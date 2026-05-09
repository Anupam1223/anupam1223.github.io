import React, { useState, useEffect } from 'react';
import { 
  Combine, ChevronLeft, ChevronRight, Code, Terminal, 
  Play, CheckCircle2, SplitSquareHorizontal, Layers, Pointer
} from 'lucide-react';

export default function JoinSplitSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'cat', title: 'Concatenate with cat()', component: CatSlide },
    { id: 'stack', title: 'Stacking with stack()', component: StackSlide },
    { id: 'split', title: 'Specific Sizes with split()', component: SplitSlide },
    { id: 'chunk', title: 'Number of Parts with chunk()', component: ChunkSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Combine size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Joining & Splitting Tensors</h2>
        <p className="text-slate-400 text-sm mb-4">torch.cat, torch.stack, torch.split, and torch.chunk</p>
        
        <div className="flex gap-2 mb-2">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-orange-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-orange-400' : ''}>
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
            className="px-5 py-2.5 rounded-xl bg-orange-600 text-white disabled:opacity-50 font-semibold transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CatSlide() {
  const [view, setView] = useState('dim0');
  const [step, setStep] = useState(0);

  // Reset animation step when the view (dim0/dim1) changes
  useEffect(() => {
    setStep(0);
  }, [view]);

  const explanations = {
    'dim0': <span><strong>dim=0 (Rows)</strong>: <code>torch.cat</code> joins the tensors vertically. The number of rows increases (2+2=4), but the number of columns (3) must match perfectly.</span>,
    'dim1': <span><strong>dim=1 (Columns)</strong>: <code>torch.cat</code> joins them horizontally. The number of columns increases (3+3=6), while the number of rows (2) stays the same.</span>,
  };

  const pyCode = {
    'dim0': `# Create two tensors\ntensor_a = torch.randn(2, 3)\ntensor_b = torch.randn(2, 3)\nprint(f"Tensor A Shape: {tensor_a.shape}")\nprint(f"Tensor B Shape: {tensor_b.shape}")\n\n# Concatenate along dimension 0 (rows)\n# Resulting shape: (2+2, 3) = (4, 3)\ncat_dim0 = torch.cat((tensor_a, tensor_b), dim=0)\nprint(f"\\nConcatenated dim=0 Shape: {cat_dim0.shape}")`,
    'dim1': `# Create two tensors\ntensor_a = torch.randn(2, 3)\ntensor_b = torch.randn(2, 3)\n\n# Concatenate along dimension 1 (columns)\n# Tensors must match in dim 0 (rows)\n# Resulting shape: (2, 3+3) = (2, 6)\ncat_dim1 = torch.cat((tensor_a, tensor_b), dim=1)\nprint(f"\\nConcatenated dim=1 Shape: {cat_dim1.shape}")`
  };

  const outCode = {
    'dim0': `Tensor A Shape: torch.Size([2, 3])\nTensor B Shape: torch.Size([2, 3])\n\nConcatenated dim=0 Shape: torch.Size([4, 3])\n\n# Result is a 4x3 matrix containing\n# all rows from A followed by all rows from B.`,
    'dim1': `Tensor A Shape: torch.Size([2, 3])\nTensor B Shape: torch.Size([2, 3])\n\nConcatenated dim=1 Shape: torch.Size([2, 6])\n\n# Result is a 2x6 matrix containing\n# cols from A followed by cols from B side-by-side.`
  };

  const tensorA = ['a11','a12','a13', 'a21','a22','a23'];
  const tensorB = ['b11','b12','b13', 'b21','b22','b23'];

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Concatenation with torch.cat</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          <code>torch.cat</code> joins a sequence of tensors along an <strong>existing dimension</strong>. All other dimensions must be exactly the same size.
        </p>

        <div className="space-y-2 mb-4">
          <button onClick={() => setView('dim0')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'dim0' ? 'border-orange-500 bg-orange-50 text-orange-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span><Play size={14} className="inline mr-2 text-orange-500"/> torch.cat((A, B), dim=0)</span>{view === 'dim0' && <CheckCircle2 size={16} className="text-orange-500" />}</button>
          <button onClick={() => setView('dim1')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'dim1' ? 'border-orange-500 bg-orange-50 text-orange-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span><Play size={14} className="inline mr-2 text-orange-500"/> torch.cat((A, B), dim=1)</span>{view === 'dim1' && <CheckCircle2 size={16} className="text-orange-500" />}</button>
        </div>

        <div className="bg-orange-50 border border-orange-200 text-orange-800 text-xs p-3 rounded-lg mb-4 shadow-sm leading-relaxed animate-in fade-in">
          {explanations[view]}
        </div>

        {/* Manual Animation Trigger */}
        <button 
          onClick={() => setStep(s => (s + 1) % 3)} 
          className="w-full py-2 mb-4 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600 shadow transition-all flex justify-center items-center gap-2"
        >
          {step === 0 ? "Step 1: Original Tensors (Click to Align)" : step === 1 ? "Step 2: Aligning (Click to Concatenate)" : "Step 3: Result (Click to Reset)"} <Pointer size={16}/>
        </button>

        {/* Interactive Visualizer */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center flex-1 min-h-[220px] relative">
          
          {step === 0 && (
            <div className="flex flex-col gap-6 w-full items-center justify-center animate-in fade-in">
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Tensor A (2x3)</span>
                <div className="grid grid-cols-3 gap-1 p-2 bg-blue-100 border-2 border-blue-400 rounded">
                  {tensorA.map((v, i) => <div key={i} className="w-9 h-9 bg-blue-200 text-blue-900 flex items-center justify-center font-mono text-xs font-bold border border-blue-300">{v}</div>)}
                </div>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Tensor B (2x3)</span>
                <div className="grid grid-cols-3 gap-1 p-2 bg-red-100 border-2 border-red-400 rounded">
                  {tensorB.map((v, i) => <div key={i} className="w-9 h-9 bg-red-200 text-red-900 flex items-center justify-center font-mono text-xs font-bold border border-red-300">{v}</div>)}
                </div>
              </div>
            </div>
          )}

          {step > 0 && view === 'dim0' && (
            <div className="flex flex-col items-center justify-center animate-in slide-in-from-bottom-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Result (4x3)</span>
              <div className={`p-2 rounded border-2 transition-all duration-700 ${step === 2 ? 'bg-slate-200 border-slate-400 shadow-lg scale-105' : 'border-transparent'}`}>
                <div className="grid grid-cols-3 gap-1 mb-1">
                  {tensorA.map((v, i) => <div key={`a${i}`} className="w-9 h-9 bg-blue-200 text-blue-900 flex items-center justify-center font-mono text-xs font-bold border border-blue-300">{v}</div>)}
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {tensorB.map((v, i) => <div key={`b${i}`} className="w-9 h-9 bg-red-200 text-red-900 flex items-center justify-center font-mono text-xs font-bold border border-red-300">{v}</div>)}
                </div>
              </div>
            </div>
          )}

          {step > 0 && view === 'dim1' && (
            <div className="flex flex-col items-center justify-center animate-in slide-in-from-bottom-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Result (2x6)</span>
              <div className={`p-2 rounded border-2 transition-all duration-700 flex gap-1 ${step === 2 ? 'bg-slate-200 border-slate-400 shadow-lg scale-105' : 'border-transparent'}`}>
                <div className="grid grid-cols-3 gap-1">
                  {tensorA.map((v, i) => <div key={`a${i}`} className="w-9 h-9 bg-blue-200 text-blue-900 flex items-center justify-center font-mono text-xs font-bold border border-blue-300">{v}</div>)}
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {tensorB.map((v, i) => <div key={`b${i}`} className="w-9 h-9 bg-red-200 text-red-900 flex items-center justify-center font-mono text-xs font-bold border border-red-300">{v}</div>)}
                </div>
              </div>
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

function StackSlide() {
  const [view, setView] = useState('dim0');
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
  }, [view]);

  const explanations = {
    'dim0': <span><strong>dim=0</strong>: Creates a new dimension at the start. The two <code>(2x3)</code> tensors are stacked to become a <code>(2x2x3)</code> tensor, acting as "slices" along depth.</span>,
    'dim1': <span><strong>dim=1</strong>: Creates a new dimension in the middle. The rows of E and F are interleaved to form a <code>(2x2x3)</code> tensor.</span>,
  };

  const pyCode = {
    'dim0': `# Create two tensors with the same shape\ntensor_e = torch.arange(6).reshape(2, 3)\ntensor_f = torch.arange(6, 12).reshape(2, 3)\n\n# Stack along a new dimension 0\n# Resulting shape: (2, 2, 3)\nstack_dim0 = torch.stack((tensor_e, tensor_f), dim=0)\nprint(f"Stacked dim=0 Shape: {stack_dim0.shape}")\nprint(stack_dim0)`,
    'dim1': `# Stack along a new dimension 1\n# Resulting shape: (2, 2, 3)\nstack_dim1 = torch.stack((tensor_e, tensor_f), dim=1)\nprint(f"Stacked dim=1 Shape: {stack_dim1.shape}")\nprint(stack_dim1)`
  };

  const outCode = {
    'dim0': `Stacked dim=0 Shape: torch.Size([2, 2, 3])\ntensor([[[ 0,  1,  2],\n         [ 3,  4,  5]],\n\n        [[ 6,  7,  8],\n         [ 9, 10, 11]]])`,
    'dim1': `Stacked dim=1 Shape: torch.Size([2, 2, 3])\ntensor([[[ 0,  1,  2],\n         [ 6,  7,  8]],\n\n        [[ 3,  4,  5],\n         [ 9, 10, 11]]])`
  };

  const tensorE = ['e11','e12','e13', 'e21','e22','e23'];
  const tensorF = ['f11','f12','f13', 'f21','f22','f23'];

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Stacking with torch.stack</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          Unlike <code>cat</code>, <code>torch.stack</code> joins tensors along a <strong>new dimension</strong>. All input tensors must have the exact same shape.
        </p>

        <div className="space-y-2 mb-4">
          <button onClick={() => setView('dim0')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'dim0' ? 'border-orange-500 bg-orange-50 text-orange-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span><Layers size={14} className="inline mr-2 text-orange-500"/> stack((E, F), dim=0)</span>{view === 'dim0' && <CheckCircle2 size={16} className="text-orange-500" />}</button>
          <button onClick={() => setView('dim1')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'dim1' ? 'border-orange-500 bg-orange-50 text-orange-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span><Layers size={14} className="inline mr-2 text-orange-500"/> stack((E, F), dim=1)</span>{view === 'dim1' && <CheckCircle2 size={16} className="text-orange-500" />}</button>
        </div>

        <div className="bg-orange-50 border border-orange-200 text-orange-800 text-xs p-3 rounded-lg mb-4 shadow-sm leading-relaxed animate-in fade-in">
          {explanations[view]}
        </div>

        {/* Manual Animation Trigger */}
        <button 
          onClick={() => setStep(s => (s + 1) % 3)} 
          className="w-full py-2 mb-4 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600 shadow transition-all flex justify-center items-center gap-2"
        >
          {step === 0 ? "Step 1: Original Tensors (Click to Align)" : step === 1 ? "Step 2: Creating New Dimension (Click to Stack)" : "Step 3: Result (Click to Reset)"} <Pointer size={16}/>
        </button>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center flex-1 min-h-[220px] relative">
          {step === 0 && (
            <div className="flex gap-4 w-full justify-center animate-in fade-in">
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Tensor E (2x3)</span>
                <div className="grid grid-cols-3 gap-1 p-2 bg-emerald-100 border-2 border-emerald-400 rounded">
                  {tensorE.map((v, i) => <div key={i} className="w-8 h-8 bg-emerald-200 text-emerald-900 flex items-center justify-center font-mono text-[10px] font-bold border border-emerald-300">{v}</div>)}
                </div>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Tensor F (2x3)</span>
                <div className="grid grid-cols-3 gap-1 p-2 bg-emerald-100 border-2 border-emerald-400 rounded">
                  {tensorF.map((v, i) => <div key={i} className="w-8 h-8 bg-emerald-200 text-emerald-900 flex items-center justify-center font-mono text-[10px] font-bold border border-emerald-300">{v}</div>)}
                </div>
              </div>
            </div>
          )}

          {step > 0 && view === 'dim0' && (
            <div className="flex flex-col items-center justify-center animate-in slide-in-from-bottom-4 w-full">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">New 3D Tensor (2x2x3)</span>
              <div className={`p-4 rounded-xl border-2 transition-all duration-700 flex flex-col gap-4 relative w-full max-w-xs ${step === 2 ? 'bg-slate-200 border-slate-400 shadow-xl' : 'border-transparent'}`}>
                <div className="relative p-2 bg-emerald-100 border-2 border-emerald-500 shadow-md">
                   <span className="text-[10px] font-bold text-emerald-800 absolute -top-3 left-2 bg-emerald-100 px-1">Slice 0</span>
                   <div className="grid grid-cols-3 gap-1">
                    {tensorE.map((v, i) => <div key={`e${i}`} className="w-full h-8 bg-emerald-200 text-emerald-900 flex items-center justify-center font-mono text-[10px] font-bold border border-emerald-300">{v}</div>)}
                   </div>
                </div>
                <div className="relative p-2 bg-emerald-100 border-2 border-emerald-500 shadow-md">
                   <span className="text-[10px] font-bold text-emerald-800 absolute -top-3 left-2 bg-emerald-100 px-1">Slice 1</span>
                   <div className="grid grid-cols-3 gap-1">
                    {tensorF.map((v, i) => <div key={`f${i}`} className="w-full h-8 bg-emerald-200 text-emerald-900 flex items-center justify-center font-mono text-[10px] font-bold border border-emerald-300">{v}</div>)}
                   </div>
                </div>
              </div>
            </div>
          )}

          {step > 0 && view === 'dim1' && (
            <div className="flex flex-col items-center justify-center animate-in slide-in-from-bottom-4 w-full">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">New 3D Tensor (2x2x3)</span>
              <div className={`p-4 rounded-xl border-2 transition-all duration-700 flex flex-col gap-4 relative w-full max-w-xs ${step === 2 ? 'bg-slate-200 border-slate-400 shadow-xl' : 'border-transparent'}`}>
                <div className="relative p-2 bg-emerald-100 border-2 border-emerald-500 shadow-md flex flex-col gap-1">
                   <span className="text-[10px] font-bold text-emerald-800 absolute -top-3 left-2 bg-emerald-100 px-1">Block 0</span>
                   <div className="grid grid-cols-3 gap-1">
                    {tensorE.slice(0,3).map((v, i) => <div key={`e${i}`} className="w-full h-8 bg-emerald-200 text-emerald-900 flex items-center justify-center font-mono text-[10px] font-bold border border-emerald-300">{v}</div>)}
                   </div>
                   <div className="grid grid-cols-3 gap-1">
                    {tensorF.slice(0,3).map((v, i) => <div key={`f${i}`} className="w-full h-8 bg-emerald-200 text-emerald-900 flex items-center justify-center font-mono text-[10px] font-bold border border-emerald-300">{v}</div>)}
                   </div>
                </div>
                <div className="relative p-2 bg-emerald-100 border-2 border-emerald-500 shadow-md flex flex-col gap-1">
                   <span className="text-[10px] font-bold text-emerald-800 absolute -top-3 left-2 bg-emerald-100 px-1">Block 1</span>
                   <div className="grid grid-cols-3 gap-1">
                    {tensorE.slice(3,6).map((v, i) => <div key={`e${i}`} className="w-full h-8 bg-emerald-200 text-emerald-900 flex items-center justify-center font-mono text-[10px] font-bold border border-emerald-300">{v}</div>)}
                   </div>
                   <div className="grid grid-cols-3 gap-1">
                    {tensorF.slice(3,6).map((v, i) => <div key={`f${i}`} className="w-full h-8 bg-emerald-200 text-emerald-900 flex items-center justify-center font-mono text-[10px] font-bold border border-emerald-300">{v}</div>)}
                   </div>
                </div>
              </div>
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

function SplitSlide() {
  const [view, setView] = useState('equal');
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
  }, [view]);

  const explanations = {
    'equal': <span>Splitting a tensor of 6 rows by <strong>size 2</strong> along dim=0 creates 3 equal chunks.</span>,
    'unequal': <span>Passing a list <strong>[1, 2, 3]</strong> along dim=0 splits the 6 rows exactly into chunks of those requested sizes.</span>,
    'dim1': <span>Splitting along <strong>dim=1 (cols)</strong> by size 1 separates the 6x2 matrix into two 6x1 column vectors.</span>
  };

  const pyCode = {
    'equal': `tensor_g = torch.arange(12).reshape(6, 2)\n\n# Split into equal chunks of size 2 along dim 0 (rows)\nsplit_equal = torch.split(tensor_g, 2, dim=0)\n\nfor i, chunk in enumerate(split_equal):\n    print(f"Chunk {i} Shape: {chunk.shape}")`,
    'unequal': `tensor_g = torch.arange(12).reshape(6, 2)\n\n# Split into unequal chunks [1, 2, 3] along dim 0\nsplit_unequal = torch.split(tensor_g, [1, 2, 3], dim=0)\n\nfor i, chunk in enumerate(split_unequal):\n    print(f"Chunk {i} Shape: {chunk.shape}")`,
    'dim1': `tensor_g = torch.arange(12).reshape(6, 2)\n\n# Split along dimension 1 (cols) into size 1\nsplit_dim1 = torch.split(tensor_g, 1, dim=1)\n\nfor i, chunk in enumerate(split_dim1):\n    print(f"Chunk {i} Shape: {chunk.shape}")`
  };

  const outCode = {
    'equal': `Chunk 0 Shape: torch.Size([2, 2])\nChunk 1 Shape: torch.Size([2, 2])\nChunk 2 Shape: torch.Size([2, 2])`,
    'unequal': `Chunk 0 Shape: torch.Size([1, 2])\nChunk 1 Shape: torch.Size([2, 2])\nChunk 2 Shape: torch.Size([3, 2])`,
    'dim1': `Chunk 0 Shape: torch.Size([6, 1])\nChunk 1 Shape: torch.Size([6, 1])`
  };

  const data = [0,1, 2,3, 4,5, 6,7, 8,9, 10,11];

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Splitting with split()</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          <code>torch.split</code> divides a tensor into chunks. You can specify either the exactly size of each chunk, or a list of specific unequal sizes. Returns a tuple of tensors.
        </p>

        <div className="space-y-2 mb-4">
          <button onClick={() => setView('equal')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'equal' ? 'border-orange-500 bg-orange-50 text-orange-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span><SplitSquareHorizontal size={14} className="inline mr-2 text-orange-500"/> split(tensor, 2, dim=0)</span>{view === 'equal' && <CheckCircle2 size={16} className="text-orange-500" />}</button>
          <button onClick={() => setView('unequal')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'unequal' ? 'border-orange-500 bg-orange-50 text-orange-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span><SplitSquareHorizontal size={14} className="inline mr-2 text-orange-500"/> split(tensor, [1,2,3], dim=0)</span>{view === 'unequal' && <CheckCircle2 size={16} className="text-orange-500" />}</button>
          <button onClick={() => setView('dim1')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'dim1' ? 'border-orange-500 bg-orange-50 text-orange-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span><SplitSquareHorizontal size={14} className="inline mr-2 text-orange-500"/> split(tensor, 1, dim=1)</span>{view === 'dim1' && <CheckCircle2 size={16} className="text-orange-500" />}</button>
        </div>

        <div className="bg-orange-50 border border-orange-200 text-orange-800 text-xs p-3 rounded-lg mb-4 shadow-sm leading-relaxed animate-in fade-in">
          {explanations[view]}
        </div>

        <button 
          onClick={() => setStep(s => (s + 1) % 2)} 
          className="w-full py-2 mb-4 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600 shadow transition-all flex justify-center items-center gap-2"
        >
          {step === 0 ? "Step 1: Original Tensor (Click to Split)" : "Step 2: Split Result (Click to Reset)"} <Pointer size={16}/>
        </button>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center flex-1 min-h-[220px] relative">
          
          <div className={`transition-all duration-700 flex ${view==='dim1' ? 'flex-row gap-4' : 'flex-col gap-2'}`}>
            
            {/* Equal rows */}
            {view === 'equal' && [0,1,2].map(chunk => (
              <div key={chunk} className={`grid grid-cols-2 gap-1 p-1 rounded transition-all duration-500 ${step===1 ? 'bg-orange-100 border border-orange-300 shadow translate-x-2' : 'bg-transparent'}`}>
                {data.slice(chunk*4, (chunk+1)*4).map(v => <div key={v} className="w-8 h-8 bg-blue-100 border border-blue-300 flex justify-center items-center font-mono text-xs">{v}</div>)}
              </div>
            ))}

            {/* Unequal rows */}
            {view === 'unequal' && (
              <>
                <div className={`grid grid-cols-2 gap-1 p-1 rounded transition-all duration-500 ${step===1 ? 'bg-orange-100 border border-orange-300 shadow translate-x-2' : 'bg-transparent'}`}>
                  {data.slice(0, 2).map(v => <div key={v} className="w-8 h-8 bg-blue-100 border border-blue-300 flex justify-center items-center font-mono text-xs">{v}</div>)}
                </div>
                <div className={`grid grid-cols-2 gap-1 p-1 rounded transition-all duration-500 ${step===1 ? 'bg-orange-100 border border-orange-300 shadow translate-x-4' : 'bg-transparent'}`}>
                  {data.slice(2, 6).map(v => <div key={v} className="w-8 h-8 bg-blue-100 border border-blue-300 flex justify-center items-center font-mono text-xs">{v}</div>)}
                </div>
                <div className={`grid grid-cols-2 gap-1 p-1 rounded transition-all duration-500 ${step===1 ? 'bg-orange-100 border border-orange-300 shadow translate-x-6' : 'bg-transparent'}`}>
                  {data.slice(6, 12).map(v => <div key={v} className="w-8 h-8 bg-blue-100 border border-blue-300 flex justify-center items-center font-mono text-xs">{v}</div>)}
                </div>
              </>
            )}

            {/* Dim 1 cols */}
            {view === 'dim1' && [0,1].map(chunk => (
              <div key={chunk} className={`grid grid-cols-1 gap-1 p-1 rounded transition-all duration-500 ${step===1 ? 'bg-orange-100 border border-orange-300 shadow -translate-y-2' : 'bg-transparent'}`}>
                {[0,1,2,3,4,5].map(r => <div key={r} className="w-8 h-8 bg-blue-100 border border-blue-300 flex justify-center items-center font-mono text-xs">{data[r*2 + chunk]}</div>)}
              </div>
            ))}

          </div>
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

function ChunkSlide() {
  const [view, setView] = useState('dim0');
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
  }, [view]);

  const explanations = {
    'dim0': <span><strong>chunk(3, dim=0)</strong>: Requests exactly 3 parts from a 5-row tensor. PyTorch splits this as evenly as possible using ceil(5/3)=2, yielding chunks of size [2, 2, 1].</span>,
    'dim1': <span><strong>chunk(2, dim=1)</strong>: Requests 2 parts from a 4-column tensor. Yields equal chunks of size [2, 2] columns.</span>,
  };

  const pyCode = {
    'dim0': `tensor_h = torch.arange(10).reshape(5, 2)\n\n# Split into 3 chunks along dimension 0\n# 5 rows / 3 chunks -> sizes [2, 2, 1]\nchunked = torch.chunk(tensor_h, 3, dim=0)\n\nfor i, c in enumerate(chunked):\n    print(f"Chunk {i} Shape: {c.shape}")`,
    'dim1': `tensor_i = torch.arange(12).reshape(3, 4)\n\n# Split into 2 chunks along dimension 1\n# 4 cols / 2 chunks -> sizes [2, 2]\nchunked = torch.chunk(tensor_i, 2, dim=1)\n\nfor i, c in enumerate(chunked):\n    print(f"Chunk {i} Shape: {c.shape}")`
  };

  const outCode = {
    'dim0': `Chunk 0 Shape: torch.Size([2, 2])\nChunk 1 Shape: torch.Size([2, 2])\nChunk 2 Shape: torch.Size([1, 2])`,
    'dim1': `Chunk 0 Shape: torch.Size([3, 2])\nChunk 1 Shape: torch.Size([3, 2])`
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Number of Parts: chunk()</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          Unlike <code>split()</code> which requires specifying chunk sizes, <code>torch.chunk</code> splits a tensor into a specified <strong>number</strong> of chunks. PyTorch handles the math to make them as equal as possible.
        </p>

        <div className="space-y-2 mb-4">
          <button onClick={() => setView('dim0')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'dim0' ? 'border-orange-500 bg-orange-50 text-orange-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span><SplitSquareHorizontal size={14} className="inline mr-2 text-orange-500"/> chunk(tensor, 3, dim=0)</span>{view === 'dim0' && <CheckCircle2 size={16} className="text-orange-500" />}</button>
          <button onClick={() => setView('dim1')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'dim1' ? 'border-orange-500 bg-orange-50 text-orange-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span><SplitSquareHorizontal size={14} className="inline mr-2 text-orange-500"/> chunk(tensor, 2, dim=1)</span>{view === 'dim1' && <CheckCircle2 size={16} className="text-orange-500" />}</button>
        </div>

        <div className="bg-orange-50 border border-orange-200 text-orange-800 text-xs p-3 rounded-lg mb-4 shadow-sm leading-relaxed animate-in fade-in">
          {explanations[view]}
        </div>

        <button 
          onClick={() => setStep(s => (s + 1) % 2)} 
          className="w-full py-2 mb-4 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600 shadow transition-all flex justify-center items-center gap-2"
        >
          {step === 0 ? "Step 1: Original Tensor (Click to Chunk)" : "Step 2: Chunked Result (Click to Reset)"} <Pointer size={16}/>
        </button>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center flex-1 min-h-[220px] relative">
          
          <div className={`transition-all duration-700 flex ${view==='dim1' ? 'flex-row gap-4' : 'flex-col gap-2'}`}>
            
            {view === 'dim0' && (
              <>
                <div className={`grid grid-cols-2 gap-1 p-1 rounded transition-all duration-500 ${step===1 ? 'bg-orange-100 border border-orange-300 shadow translate-x-2' : 'bg-transparent'}`}>
                  {[0,1,2,3].map(v => <div key={v} className="w-8 h-8 bg-blue-100 border border-blue-300 flex justify-center items-center font-mono text-xs">{v}</div>)}
                </div>
                <div className={`grid grid-cols-2 gap-1 p-1 rounded transition-all duration-500 ${step===1 ? 'bg-orange-100 border border-orange-300 shadow translate-x-4' : 'bg-transparent'}`}>
                  {[4,5,6,7].map(v => <div key={v} className="w-8 h-8 bg-blue-100 border border-blue-300 flex justify-center items-center font-mono text-xs">{v}</div>)}
                </div>
                <div className={`grid grid-cols-2 gap-1 p-1 rounded transition-all duration-500 ${step===1 ? 'bg-orange-100 border border-orange-300 shadow translate-x-6' : 'bg-transparent'}`}>
                  {[8,9].map(v => <div key={v} className="w-8 h-8 bg-blue-100 border border-blue-300 flex justify-center items-center font-mono text-xs">{v}</div>)}
                </div>
              </>
            )}

            {view === 'dim1' && (
              <>
                <div className={`grid grid-cols-2 gap-1 p-1 rounded transition-all duration-500 ${step===1 ? 'bg-orange-100 border border-orange-300 shadow -translate-y-2' : 'bg-transparent'}`}>
                  {[0,1,4,5,8,9].map(v => <div key={v} className="w-8 h-8 bg-blue-100 border border-blue-300 flex justify-center items-center font-mono text-xs">{v}</div>)}
                </div>
                <div className={`grid grid-cols-2 gap-1 p-1 rounded transition-all duration-500 ${step===1 ? 'bg-orange-100 border border-orange-300 shadow translate-y-2' : 'bg-transparent'}`}>
                  {[2,3,6,7,10,11].map(v => <div key={v} className="w-8 h-8 bg-blue-100 border border-blue-300 flex justify-center items-center font-mono text-xs">{v}</div>)}
                </div>
              </>
            )}

          </div>
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