import React, { useState } from 'react';
import { Box, ChevronLeft, ChevronRight, CheckCircle2, Code, Terminal, ArrowRight } from 'lucide-react';

export default function CreationSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'existing', title: 'From Existing Data', component: ExistingDataSlide },
    { id: 'shapes', title: 'Specific Shapes & Values', component: ShapesSlide },
    { id: 'random', title: 'Random Values', component: RandomSlide },
    { id: 'like', title: 'Based on Other Tensors', component: LikeSlide },
  ];

  const handleNext = () => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
  const handlePrev = () => setCurrentSlide((prev) => Math.max(0, prev - 1));

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Integrated Slider Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Box size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Creating PyTorch Tensors</h2>
        <p className="text-slate-400 text-sm mb-4">Interactive Visual Study Guide</p>
        
        {/* Progress Steps */}
        <div className="flex gap-2">
          {slides.map((slide, idx) => (
            <div 
              key={slide.id} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-blue-500' : idx < currentSlide ? 'bg-blue-800' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs mt-2 text-slate-400 font-medium">
          {slides.map((slide, idx) => (
            <span key={slide.id} className={idx === currentSlide ? 'text-blue-400' : ''}>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}

// --- Slide 1: Existing Data ---
function ExistingDataSlide() {
  const [source, setSource] = useState('list');

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div>
        <h3 className="text-xl font-bold mb-4">From Existing Data</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          The most direct way to create a tensor is from existing Python data structures using <code>torch.tensor()</code>. PyTorch intelligently infers the data type (dtype) and copies the input data.
        </p>
        
        <div className="space-y-3 mb-6">
          <button 
            onClick={() => setSource('list')}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-between ${source === 'list' ? 'border-blue-500 bg-blue-50 text-blue-900 font-semibold' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
          >
            <span>Python List (Integers)</span>
            {source === 'list' && <CheckCircle2 size={18} className="text-blue-500" />}
          </button>
          <button 
            onClick={() => setSource('numpy')}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-between ${source === 'numpy' ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
          >
            <span>NumPy Array (Floats)</span>
            {source === 'numpy' && <CheckCircle2 size={18} className="text-emerald-500" />}
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-800">
          <strong>Note:</strong> PyTorch automatically infers <code>int64</code> for integer lists and <code>float64</code> for standard NumPy float arrays.
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-4 shadow-inner flex flex-col font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-400 mb-2 px-2">
          <Code size={14} /> <span className="font-semibold uppercase tracking-wider">Python Code</span>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl text-slate-300 mb-4 flex-1">
          {source === 'list' ? (
            <pre>
<span className="text-pink-400">import</span> torch{'\n\n'}
<span className="text-slate-500"># Create from list</span>{'\n'}
data_list = [[<span className="text-orange-400">1</span>, <span className="text-orange-400">2</span>], [<span className="text-orange-400">3</span>, <span className="text-orange-400">4</span>]]{'\n'}
tensor = torch.<span className="text-blue-300">tensor</span>(data_list)
            </pre>
          ) : (
            <pre>
<span className="text-pink-400">import</span> torch{'\n'}
<span className="text-pink-400">import</span> numpy <span className="text-pink-400">as</span> np{'\n\n'}
<span className="text-slate-500"># Create from numpy</span>{'\n'}
data_numpy = np.<span className="text-blue-300">array</span>([[<span className="text-orange-400">5.0</span>, <span className="text-orange-400">6.0</span>], [<span className="text-orange-400">7.0</span>, <span className="text-orange-400">8.0</span>]]){'\n'}
tensor = torch.<span className="text-blue-300">tensor</span>(data_numpy)
            </pre>
          )}
        </div>

        <div className="flex items-center gap-2 text-slate-400 mb-2 px-2">
          <Terminal size={14} /> <span className="font-semibold uppercase tracking-wider">Output</span>
        </div>
        <div className="bg-black/40 p-4 rounded-xl text-emerald-400">
          {source === 'list' ? (
            <pre>
tensor([[1, 2],{'\n'}
        [3, 4]]){'\n'}
dtype: torch.int64{'\n'}
shape: torch.Size([2, 2])
            </pre>
          ) : (
            <pre>
tensor([[5., 6.],{'\n'}
        [7., 8.]], dtype=torch.float64){'\n'}
dtype: torch.float64{'\n'}
shape: torch.Size([2, 2])
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Slide 2: Specific Shapes ---
function ShapesSlide() {
  const [func, setFunc] = useState('zeros');

  const funcs = [
    { id: 'zeros', label: 'torch.zeros()', val: '0.' },
    { id: 'ones', label: 'torch.ones()', val: '1.' },
    { id: 'empty', label: 'torch.empty()', val: '?' },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Specific Shapes & Values</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Often you need to initialize tensors with a specific size. PyTorch provides dedicated functions to create tensors filled with 0s, 1s, or uninitialized memory (garbage values).
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {funcs.map((f) => (
            <button
              key={f.id}
              onClick={() => setFunc(f.id)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border-2 transition-all ${
                func === f.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px]">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-4">Visualizer: Shape (2, 3)</p>
          <div className="grid grid-cols-3 gap-2 w-full max-w-[200px]">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`h-12 rounded flex items-center justify-center font-mono font-bold text-sm shadow-sm border-2 ${
                func === 'zeros' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                func === 'ones' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                'bg-slate-200 border-slate-300 text-slate-500 text-[10px] text-center p-1'
              }`}>
                {func === 'empty' ? `${(Math.random() * 1e-10).toExponential(1)}` : funcs.find(f=>f.id===func).val}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-4 shadow-inner flex flex-col font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-400 mb-2 px-2">
          <Code size={14} /> <span className="font-semibold uppercase tracking-wider">Python</span>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl text-slate-300 mb-4 flex-1">
<pre>
shape = (<span className="text-orange-400">2</span>, <span className="text-orange-400">3</span>){'\n\n'}
<span className="text-slate-500"># Default dtype is float32</span>{'\n'}
tensor = torch.<span className="text-blue-300">{func}</span>(shape)
</pre>
        </div>

        <div className="flex items-center gap-2 text-slate-400 mb-2 px-2">
          <Terminal size={14} /> <span className="font-semibold uppercase tracking-wider">Output</span>
        </div>
        <div className="bg-black/40 p-4 rounded-xl text-emerald-400">
          {func === 'zeros' && <pre>tensor([[0., 0., 0.],{'\n'}        [0., 0., 0.]])</pre>}
          {func === 'ones' && <pre>tensor([[1., 1., 1.],{'\n'}        [1., 1., 1.]])</pre>}
          {func === 'empty' && <pre>tensor([[1.2e-38, 4.5e-41, 0.0e+00],{'\n'}        [3.1e-32, 1.8e+00, 2.1e-40]])</pre>}
        </div>
      </div>
    </div>
  );
}

// --- Slide 3: Random Values ---
function RandomSlide() {
  const [dist, setDist] = useState('rand');

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div>
        <h3 className="text-xl font-bold mb-4">Random Values</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Initializing model parameters (like weights) requires random values. PyTorch provides different distributions for this purpose.
        </p>

        <div className="space-y-4 mb-6">
          <div 
            onClick={() => setDist('rand')}
            className={`cursor-pointer p-3 rounded-xl border-2 transition-all ${dist === 'rand' ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:border-slate-300'}`}
          >
            <h4 className={`font-bold font-mono text-sm mb-1 ${dist === 'rand' ? 'text-purple-700' : 'text-slate-700'}`}>torch.rand()</h4>
            <p className="text-xs text-slate-600">Uniform distribution between <code>[0, 1)</code>.</p>
          </div>
          
          <div 
            onClick={() => setDist('randn')}
            className={`cursor-pointer p-3 rounded-xl border-2 transition-all ${dist === 'randn' ? 'border-rose-500 bg-rose-50' : 'border-slate-200 hover:border-slate-300'}`}
          >
            <h4 className={`font-bold font-mono text-sm mb-1 ${dist === 'randn' ? 'text-rose-700' : 'text-slate-700'}`}>torch.randn()</h4>
            <p className="text-xs text-slate-600">Standard normal distribution (mean 0, variance 1). Can be negative or positive.</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-4 shadow-inner flex flex-col font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-400 mb-2 px-2">
          <Code size={14} /> <span className="font-semibold uppercase tracking-wider">Python</span>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl text-slate-300 mb-4 flex-1">
<pre>
shape = (<span className="text-orange-400">2</span>, <span className="text-orange-400">3</span>){'\n\n'}
<span className="text-slate-500"># Random initialization</span>{'\n'}
tensor = torch.<span className="text-blue-300">{dist}</span>(shape)
</pre>
        </div>

        <div className="flex items-center gap-2 text-slate-400 mb-2 px-2">
          <Terminal size={14} /> <span className="font-semibold uppercase tracking-wider">Output (Sample)</span>
        </div>
        <div className="bg-black/40 p-4 rounded-xl text-emerald-400 flex-1 flex items-center">
          {dist === 'rand' ? (
<pre>
tensor([[0.6580, 0.5089, 0.1642],{'\n'}
        [0.3742, 0.5989, 0.7775]])
</pre>
          ) : (
<pre>
tensor([[-0.2651, -0.3249, -1.0134],{'\n'}
        [ 1.1314,  1.1751, -0.1411]])
</pre>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Slide 4: Like Variants ---
function LikeSlide() {
  const [func, setFunc] = useState('zeros_like');

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Based on Other Tensors</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          To create a new tensor that shares the exact <strong>shape</strong> and <strong>dtype</strong> of an existing tensor, use the <code>_like</code> variants.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setFunc('zeros_like')} className={`px-2 py-1 rounded font-mono text-[10px] sm:text-xs border-2 ${func === 'zeros_like' ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 text-slate-600'}`}>zeros_like()</button>
          <button onClick={() => setFunc('ones_like')} className={`px-2 py-1 rounded font-mono text-[10px] sm:text-xs border-2 ${func === 'ones_like' ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 text-slate-600'}`}>ones_like()</button>
          <button onClick={() => setFunc('rand_like')} className={`px-2 py-1 rounded font-mono text-[10px] sm:text-xs border-2 ${func === 'rand_like' ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 text-slate-600'}`}>rand_like()</button>
        </div>

        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-center gap-4">
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex-1 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase">Base Tensor</p>
              <div className="grid grid-cols-2 gap-1 w-16">
                <div className="bg-slate-200 h-6 flex items-center justify-center font-mono text-xs">1.</div>
                <div className="bg-slate-200 h-6 flex items-center justify-center font-mono text-xs">2.</div>
                <div className="bg-slate-200 h-6 flex items-center justify-center font-mono text-xs">3.</div>
                <div className="bg-slate-200 h-6 flex items-center justify-center font-mono text-xs">4.</div>
              </div>
            </div>

            <ArrowRight className="text-blue-400 flex-shrink-0" size={24} />

            <div className="flex-1 bg-blue-50 p-3 rounded-xl shadow-sm border border-blue-200">
              <p className="text-[10px] font-bold text-blue-500 mb-2 uppercase">New Tensor</p>
              <div className="grid grid-cols-2 gap-1 w-16">
                {func === 'zeros_like' && [...Array(4)].map((_,i)=><div key={i} className="bg-blue-200 text-blue-800 h-6 flex items-center justify-center font-mono text-xs">0.</div>)}
                {func === 'ones_like' && [...Array(4)].map((_,i)=><div key={i} className="bg-blue-200 text-blue-800 h-6 flex items-center justify-center font-mono text-xs">1.</div>)}
                {func === 'rand_like' && [...Array(4)].map((_,i)=><div key={i} className="bg-purple-200 text-purple-800 h-6 flex items-center justify-center font-mono text-[10px]">0.{Math.floor(Math.random()*99)}</div>)}
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-4 shadow-inner flex flex-col font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-400 mb-2 px-2">
          <Code size={14} /> <span className="font-semibold uppercase tracking-wider">Python</span>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl text-slate-300 mb-4 flex-1">
<pre>
base = torch.<span className="text-blue-300">tensor</span>([[<span className="text-orange-400">1.</span>, <span className="text-orange-400">2.</span>],{'\n'}                     [<span className="text-orange-400">3.</span>, <span className="text-orange-400">4.</span>]]){'\n\n'}
<span className="text-slate-500"># Copies shape & dtype</span>{'\n'}
new_tensor = torch.<span className="text-blue-300">{func}</span>(base)
</pre>
        </div>

        <div className="flex items-center gap-2 text-slate-400 mb-2 px-2">
          <Terminal size={14} /> <span className="font-semibold uppercase tracking-wider">Output</span>
        </div>
        <div className="bg-black/40 p-4 rounded-xl text-emerald-400">
          {func === 'zeros_like' && <pre>tensor([[0., 0.],{'\n'}        [0., 0.]])</pre>}
          {func === 'ones_like' && <pre>tensor([[1., 1.],{'\n'}        [1., 1.]])</pre>}
          {func === 'rand_like' && <pre>tensor([[0.1216, 0.5908],{'\n'}        [0.3264, 0.9272]])</pre>}
        </div>
      </div>
    </div>
  );
}
