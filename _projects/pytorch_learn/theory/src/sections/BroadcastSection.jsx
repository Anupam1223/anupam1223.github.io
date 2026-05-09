import React, { useState, useEffect } from 'react';
import { 
  Cast, ChevronLeft, ChevronRight, Code, Terminal, 
  CheckCircle2, Pointer, AlertTriangle, Info, AlignRight
} from 'lucide-react';

export default function BroadcastingSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'concept', title: 'What is Broadcasting?', component: ConceptSlide },
    { id: 'intro', title: 'Rules & Scalars', component: ScalarSlide },
    { id: 'vectors', title: 'Row & Col Vectors', component: VectorSlide },
    { id: 'visual', title: 'Visual Expansion', component: VisualExpansionSlide },
    { id: 'incompatible', title: 'Incompatible Shapes', component: IncompatibleSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Cast size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Understanding Broadcasting</h2>
        <p className="text-slate-400 text-sm mb-4">Automatically expanding tensor dimensions for operations</p>
        
        <div className="flex gap-2 mb-2">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-violet-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-violet-400' : ''}>
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
            className="px-5 py-2.5 rounded-xl bg-violet-600 text-white disabled:opacity-50 font-semibold transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ConceptSlide() {
  const [step, setStep] = useState(0);

  const explanations = [
    <span><strong>Why Broadcast?</strong> Manually reshaping tensors to match shapes wastes memory and adds clutter. Broadcasting automatically expands dimensions without duplicating data in memory.</span>,
    <span><strong>Rule 1: Align Right.</strong> PyTorch aligns shapes from the trailing (rightmost) dimension. If a tensor lacks dimensions (like Tensor B), it gets implicit leading 1s. <code>[4, 3]</code> becomes <code>[1, 4, 3]</code>.</span>,
    <span><strong>Rule 2: Compatible Dims.</strong> From right-to-left, dimension pairs are compatible if: <strong>1) They are equal</strong>, or <strong>2) One of them is 1</strong>. (1 aligns with 3, 4 aligns with 4, 5 aligns with 1).</span>,
    <span><strong>Rule 3: Result Shape.</strong> The output shape takes the maximum size of each dimension pair. Example: <code>[5, 4, 1] + [4, 3] = [5, 4, 3]</code>.</span>
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">What is Broadcasting?</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          Broadcasting is PyTorch's mechanism to apply element-wise operations between tensors of different, but compatible, shapes. It saves you from writing <code>.repeat()</code> explicitly!
        </p>
        
        <button 
          onClick={() => setStep(s => (s + 1) % 4)} 
          className="w-full py-2 mb-4 bg-violet-500 text-white rounded-lg text-sm font-bold hover:bg-violet-600 shadow transition-all flex justify-center items-center gap-2"
        >
          {step === 0 ? "Step 1: The Problem (Click to Align Shapes)" : step === 1 ? "Step 2: Check Compatibility (Click to Compare)" : step === 2 ? "Step 3: Resulting Shape (Click to Finish)" : "Step 4: Review (Click to Reset)"} <Pointer size={16}/>
        </button>

        <div className="bg-violet-50 border border-violet-200 text-violet-800 text-xs p-3 rounded-lg mb-4 shadow-sm leading-relaxed min-h-[60px] animate-in fade-in">
          {explanations[step]}
        </div>
        
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center flex-1 min-h-[220px] relative overflow-hidden">
           <div className="flex flex-col items-end gap-2 font-mono text-sm font-bold w-full max-w-[200px] mx-auto">
             
             <div className="flex items-center gap-3 w-full justify-end">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">Tensor A</span>
                <div className="flex gap-1">
                  <div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${step >= 2 ? 'bg-emerald-100 text-emerald-800 border-emerald-300 border' : 'bg-slate-200 text-slate-800 border-slate-300 border'}`}>5</div>
                  <div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${step >= 2 ? 'bg-emerald-100 text-emerald-800 border-emerald-300 border' : 'bg-slate-200 text-slate-800 border-slate-300 border'}`}>4</div>
                  <div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${step >= 2 ? 'bg-amber-100 text-amber-800 border-amber-300 border' : 'bg-slate-200 text-slate-800 border-slate-300 border'}`}>1</div>
                </div>
             </div>

             <div className="flex items-center gap-3 w-full justify-end">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">Tensor B</span>
                <div className="flex gap-1">
                  <div className={`w-8 h-8 rounded flex items-center justify-center border-2 border-dashed transition-all ${step >= 1 ? 'border-slate-300 text-slate-400 bg-transparent' : 'border-transparent bg-transparent opacity-0 text-transparent'}`}>1</div>
                  <div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${step >= 2 ? 'bg-emerald-100 text-emerald-800 border-emerald-300 border' : 'bg-slate-200 text-slate-800 border-slate-300 border'}`}>4</div>
                  <div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${step >= 2 ? 'bg-amber-100 text-amber-800 border-amber-300 border' : 'bg-slate-200 text-slate-800 border-slate-300 border'}`}>3</div>
                </div>
             </div>
             
             {step >= 3 && (
               <div className="flex items-center gap-3 mt-2 pt-3 w-full justify-end border-t-2 border-slate-300 animate-in slide-in-from-bottom-2">
                  <span className="text-[10px] text-violet-600 font-bold uppercase tracking-widest">Result C</span>
                  <div className="flex gap-1">
                    <div className="w-8 h-8 rounded flex items-center justify-center bg-violet-500 text-white shadow-md">5</div>
                    <div className="w-8 h-8 rounded flex items-center justify-center bg-violet-500 text-white shadow-md">4</div>
                    <div className="w-8 h-8 rounded flex items-center justify-center bg-violet-500 text-white shadow-md">3</div>
                  </div>
               </div>
             )}

           </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 overflow-hidden">
         <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex-1 flex flex-col gap-4">
            <h4 className="font-bold flex items-center gap-2 text-slate-800 border-b pb-2"><AlignRight size={18} className="text-violet-500"/> Core Rules Checklist</h4>
            <ul className="text-sm space-y-4 text-slate-600">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className={step >= 1 ? "text-emerald-500 flex-shrink-0 mt-0.5 transition-colors" : "text-slate-300 flex-shrink-0 mt-0.5 transition-colors"} />
                <span>Always align shape dimensions by the <strong>trailing (rightmost)</strong> edge.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className={step >= 2 ? "text-emerald-500 flex-shrink-0 mt-0.5 transition-colors" : "text-slate-300 flex-shrink-0 mt-0.5 transition-colors"} />
                <span>Check dimension pairs from right to left. They must be <strong>equal</strong>, or one must be <strong>1</strong>.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className={step >= 2 ? "text-emerald-500 flex-shrink-0 mt-0.5 transition-colors" : "text-slate-300 flex-shrink-0 mt-0.5 transition-colors"} />
                <span>If a dimension is missing on the left, it implicitly acts as a <strong>1</strong>.</span>
              </li>
            </ul>
         </div>
      </div>
    </div>
  );
}

function ScalarSlide() {
  const [step, setStep] = useState(0);

  const explanations = [
    <span><strong>Step 1:</strong> We have a 2x3 matrix <code>A</code> and a scalar (0D tensor) <code>B</code> with value 10.</span>,
    <span><strong>Step 2: Broadcasting!</strong> The scalar <code>B</code> is virtually expanded to match the <code>[2, 3]</code> shape of <code>A</code>. It's as if <code>B</code> became a 2x3 matrix of 10s. Memory isn't actually copied!</span>,
    <span><strong>Step 3: Element-wise Operation.</strong> The addition is performed element-by-element, resulting in a new <code>[2, 3]</code> tensor.</span>
  ];

  const pyCode = `import torch\n\n# Tensor A: Shape [2, 3]\na = torch.tensor([[1, 2, 3], \n                  [4, 5, 6]])\n\n# Scalar B: Shape [] (0 dimensions)\nb = torch.tensor(10)\n\n# Add scalar to tensor\nc = a + b\n\nprint(f"Shape of a: {a.shape}")\nprint(f"Shape of b: {b.shape}")\nprint(f"Shape of c: {c.shape}")\nprint(f"Result c:\\n{c}")`;
  const outCode = `Shape of a: torch.Size([2, 3])\nShape of b: torch.Size([])\nShape of c: torch.Size([2, 3])\nResult c:\ntensor([[11, 12, 13],\n        [14, 15, 16]])`;
  const tensorA = [1, 2, 3, 4, 5, 6];

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Scalars & Constant Expansion</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          Adding a scalar (a 0-dimensional tensor) to any tensor always works via broadcasting. The scalar is effectively expanded to match the tensor's exact shape.
        </p>

        <button 
          onClick={() => setStep(s => (s + 1) % 3)} 
          className="w-full py-2 mb-4 bg-violet-500 text-white rounded-lg text-sm font-bold hover:bg-violet-600 shadow transition-all flex justify-center items-center gap-2"
        >
          {step === 0 ? "Step 1: Original Tensors (Click to Broadcast)" : step === 1 ? "Step 2: Scalar Expands (Click to Add)" : "Step 3: Result (Click to Reset)"} <Pointer size={16}/>
        </button>

        <div className="bg-violet-50 border border-violet-200 text-violet-800 text-xs p-3 rounded-lg mb-4 shadow-sm leading-relaxed min-h-[60px]">
          {explanations[step]}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center flex-1 min-h-[220px] relative">
          {step === 0 && (
            <div className="flex items-center gap-8 w-full justify-center animate-in fade-in">
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Tensor A [2, 3]</span>
                <div className="grid grid-cols-3 gap-1 p-2 bg-blue-100 border-2 border-blue-400 rounded">
                  {tensorA.map((v, i) => <div key={i} className="w-8 h-8 bg-blue-200 text-blue-900 flex items-center justify-center font-mono text-xs font-bold border border-blue-300">{v}</div>)}
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-300">+</div>
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Scalar B []</span>
                <div className="p-2 bg-rose-100 border-2 border-rose-400 rounded inline-block">
                  <div className="w-8 h-8 bg-rose-200 text-rose-900 flex items-center justify-center font-mono text-xs font-bold border border-rose-300">10</div>
                </div>
              </div>
            </div>
          )}
          {step === 1 && (
             <div className="flex items-center gap-4 w-full justify-center animate-in zoom-in-95">
               <div className="grid grid-cols-3 gap-1 p-2 bg-blue-100 border-2 border-blue-400 rounded">
                 {tensorA.map((v, i) => <div key={`a${i}`} className="w-8 h-8 bg-blue-200 text-blue-900 flex items-center justify-center font-mono text-xs font-bold border border-blue-300">{v}</div>)}
               </div>
               <div className="text-2xl font-bold text-slate-300">+</div>
               <div className="grid grid-cols-3 gap-1 p-2 bg-rose-100 border-2 border-rose-400 rounded border-dashed">
                 {tensorA.map((v, i) => <div key={`b${i}`} className="w-8 h-8 bg-rose-100 text-rose-500 flex items-center justify-center font-mono text-xs font-bold border border-rose-200 border-dashed">10</div>)}
               </div>
             </div>
          )}
          {step === 2 && (
            <div className="flex flex-col items-center justify-center animate-in slide-in-from-bottom-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Result C [2, 3]</span>
              <div className="grid grid-cols-3 gap-1 p-2 bg-emerald-100 border-2 border-emerald-400 rounded shadow-lg scale-110">
                {tensorA.map((v, i) => <div key={`c${i}`} className="w-8 h-8 bg-emerald-200 text-emerald-900 flex items-center justify-center font-mono text-xs font-bold border border-emerald-300">{v + 10}</div>)}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[300px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[200px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} /> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{outCode}</pre>
        </div>
      </div>
    </div>
  );
}

function VectorSlide() {
  const [view, setView] = useState('row');
  const [step, setStep] = useState(0);

  useEffect(() => { setStep(0); }, [view]);

  const explanations = {
    'row': [
      <span><strong>Step 1:</strong> Matrix <code>A</code> is [2, 3]. Row Vector <code>B</code> is [3].</span>,
      <span><strong>Step 2: Align & Expand.</strong> <code>B</code> is treated as [1, 3]. Since dim 0 is 1 and A's dim 0 is 2, <code>B</code> is <strong>copied down across the rows</strong> to become [2, 3].</span>,
      <span><strong>Step 3: Result.</strong> The values are added element-wise. Shape becomes [2, 3].</span>
    ],
    'col': [
      <span><strong>Step 1:</strong> Matrix <code>A</code> is [2, 3]. Column Vector <code>B</code> is [2, 1].</span>,
      <span><strong>Step 2: Align & Expand.</strong> <code>B</code>'s dim 1 is size 1. A's dim 1 is size 3. Therefore, <code>B</code> is <strong>copied across the columns</strong> to match A.</span>,
      <span><strong>Step 3: Result.</strong> The values are added element-wise. Shape becomes [2, 3].</span>
    ]
  };

  const pyCode = {
    'row': `# Tensor A: Shape [2, 3]\na = torch.tensor([[1, 2, 3],\n                  [4, 5, 6]])\n\n# Tensor B: Shape [3]\n# (treated as [1, 3] for broadcasting)\nb = torch.tensor([10, 20, 30])\n\n# Add row vector to matrix\nc = a + b\n\nprint(f"Shape of c: {c.shape}")\nprint(f"Result c:\\n{c}")`,
    'col': `# Tensor A: Shape [2, 3]\na = torch.tensor([[1, 2, 3],\n                  [4, 5, 6]])\n\n# Tensor B: Shape [2, 1]\nb = torch.tensor([[10], [20]])\n\n# Add column vector to matrix\nc = a + b\n\nprint(f"Shape of c: {c.shape}")\nprint(f"Result c:\\n{c}")`
  };

  const outCode = {
    'row': `Shape of c: torch.Size([2, 3])\nResult c:\ntensor([[11, 22, 33],\n        [14, 25, 36]])`,
    'col': `Shape of c: torch.Size([2, 3])\nResult c:\ntensor([[11, 12, 13],\n        [24, 25, 26]])`
  };

  const aVals = [1, 2, 3, 4, 5, 6];
  const rowVals = [10, 20, 30];
  const colVals = [10, 20];

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Row & Column Vectors</h3>
        
        <div className="space-y-2 mb-4">
          <button onClick={() => setView('row')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'row' ? 'border-violet-500 bg-violet-50 text-violet-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span>Row Vector [3] + Matrix [2, 3]</span>{view === 'row' && <CheckCircle2 size={16} className="text-violet-500" />}</button>
          <button onClick={() => setView('col')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'col' ? 'border-violet-500 bg-violet-50 text-violet-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span>Col Vector [2, 1] + Matrix [2, 3]</span>{view === 'col' && <CheckCircle2 size={16} className="text-violet-500" />}</button>
        </div>

        <button 
          onClick={() => setStep(s => (s + 1) % 3)} 
          className="w-full py-2 mb-4 bg-violet-500 text-white rounded-lg text-sm font-bold hover:bg-violet-600 shadow transition-all flex justify-center items-center gap-2"
        >
          {step === 0 ? "Step 1: Original (Click to Expand)" : step === 1 ? "Step 2: Broadcasting (Click to Add)" : "Step 3: Result (Click to Reset)"} <Pointer size={16}/>
        </button>

        <div className="bg-violet-50 border border-violet-200 text-violet-800 text-xs p-3 rounded-lg mb-4 shadow-sm min-h-[60px]">
          {explanations[view][step]}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center flex-1 min-h-[200px] relative">
          {step === 0 && (
            <div className="flex items-center gap-6 w-full justify-center animate-in fade-in">
              <div className="grid grid-cols-3 gap-1 p-2 bg-blue-100 border-2 border-blue-400 rounded">
                {aVals.map((v, i) => <div key={i} className="w-8 h-8 bg-blue-200 text-blue-900 flex items-center justify-center font-mono text-xs font-bold border border-blue-300">{v}</div>)}
              </div>
              <div className="text-2xl font-bold text-slate-300">+</div>
              {view === 'row' ? (
                <div className="grid grid-cols-3 gap-1 p-2 bg-rose-100 border-2 border-rose-400 rounded">
                  {rowVals.map((v, i) => <div key={i} className="w-8 h-8 bg-rose-200 text-rose-900 flex items-center justify-center font-mono text-xs font-bold border border-rose-300">{v}</div>)}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-1 p-2 bg-rose-100 border-2 border-rose-400 rounded">
                  {colVals.map((v, i) => <div key={i} className="w-8 h-8 bg-rose-200 text-rose-900 flex items-center justify-center font-mono text-xs font-bold border border-rose-300">{v}</div>)}
                </div>
              )}
            </div>
          )}

          {step === 1 && (
             <div className="flex items-center gap-4 w-full justify-center animate-in zoom-in-95">
               <div className="grid grid-cols-3 gap-1 p-2 bg-blue-100 border-2 border-blue-400 rounded">
                 {aVals.map((v, i) => <div key={i} className="w-8 h-8 bg-blue-200 text-blue-900 flex items-center justify-center font-mono text-xs font-bold border border-blue-300">{v}</div>)}
               </div>
               <div className="text-2xl font-bold text-slate-300">+</div>
               <div className="grid grid-cols-3 gap-1 p-2 bg-rose-100 border-2 border-rose-400 rounded border-dashed">
                 {view === 'row' 
                    ? [...rowVals, ...rowVals].map((v, i) => <div key={i} className={`w-8 h-8 flex items-center justify-center font-mono text-xs font-bold border border-dashed ${i >= 3 ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-rose-200 border-rose-300 text-rose-900'}`}>{v}</div>)
                    : [colVals[0], colVals[0], colVals[0], colVals[1], colVals[1], colVals[1]].map((v, i) => <div key={i} className={`w-8 h-8 flex items-center justify-center font-mono text-xs font-bold border border-dashed ${i%3 !== 0 ? 'bg-rose-50 border-rose-200 text-rose-400' : 'bg-rose-200 border-rose-300 text-rose-900'}`}>{v}</div>)
                 }
               </div>
             </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center justify-center animate-in slide-in-from-bottom-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Result C [2, 3]</span>
              <div className="grid grid-cols-3 gap-1 p-2 bg-emerald-100 border-2 border-emerald-400 rounded shadow-lg scale-110">
                {view === 'row' 
                  ? [11, 22, 33, 14, 25, 36].map((v, i) => <div key={i} className="w-8 h-8 bg-emerald-200 text-emerald-900 flex items-center justify-center font-mono text-xs font-bold border border-emerald-300">{v}</div>)
                  : [11, 12, 13, 24, 25, 26].map((v, i) => <div key={i} className="w-8 h-8 bg-emerald-200 text-emerald-900 flex items-center justify-center font-mono text-xs font-bold border border-emerald-300">{v}</div>)
                }
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

function VisualExpansionSlide() {
  const [step, setStep] = useState(0);

  const explanations = [
    <span><strong>Step 1: Raw Tensors.</strong> Tensor A is <code>[3, 1]</code> (column). Tensor B is <code>[4]</code> (row).</span>,
    <span><strong>Step 2: Alignment.</strong> B is right-aligned to match A's trailing dimensions. PyTorch implicitly adds a dimension to B, treating it as <code>[1, 4]</code>.</span>,
    <span><strong>Step 3: Expansion.</strong> Tensor A expands its 1-dimension (columns) to match B's 4. Tensor B expands its 1-dimension (rows) to match A's 3. Both effectively become <code>[3, 4]</code>.</span>,
    <span><strong>Step 4: Addition.</strong> Element-wise addition occurs on the virtually expanded grids.</span>
  ];

  return (
    <div className="animate-in fade-in duration-500 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold">Visual Expansion</h3>
          <p className="text-slate-600 text-sm">Interactive breakdown of <code>[3, 1] + [4] -&gt; [3, 4]</code></p>
        </div>
        <button 
          onClick={() => setStep(s => (s + 1) % 4)} 
          className="px-6 py-2 bg-violet-500 text-white rounded-lg text-sm font-bold hover:bg-violet-600 shadow transition-all flex items-center gap-2"
        >
          {step === 0 ? "1. Show Tensors" : step === 1 ? "2. Align Shapes" : step === 2 ? "3. Expand Dims" : "4. Show Result"} <Pointer size={16}/>
        </button>
      </div>

      <div className="bg-violet-50 border border-violet-200 text-violet-800 text-sm p-4 rounded-lg mb-6 shadow-sm">
        {explanations[step]}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center flex-1 relative min-h-[300px]">
        {/* Step 0 & 1: Initial & Align */}
        {(step === 0 || step === 1) && (
          <div className={`flex gap-12 items-center transition-all duration-700 ${step === 1 ? 'items-start' : ''}`}>
            <div className="flex flex-col items-center bg-[#c7c0ff] p-4 rounded border border-slate-400 shadow-sm">
              <span className="text-xs font-bold text-slate-800 mb-2">Tensor A [3, 1]</span>
              <div className="grid grid-cols-1 gap-0 bg-white border border-slate-800">
                <div className="w-16 h-8 flex items-center justify-center border border-slate-300 text-xs font-mono">A1</div>
                <div className="w-16 h-8 flex items-center justify-center border border-slate-300 text-xs font-mono">A2</div>
                <div className="w-16 h-8 flex items-center justify-center border border-slate-300 text-xs font-mono">A3</div>
              </div>
            </div>

            {step === 0 ? <div className="text-2xl font-bold text-slate-300">+</div> : <div className="w-8"></div>}

            <div className={`flex flex-col items-center bg-[#a8dbff] p-4 rounded border border-slate-400 shadow-sm transition-all duration-700 ${step === 1 ? 'mt-16 relative' : ''}`}>
              {step === 1 && <span className="absolute -top-10 text-[10px] text-blue-600 bg-blue-50 px-2 border rounded whitespace-nowrap">Add Dim 0 -{'>'} [1, 4]</span>}
              <span className="text-xs font-bold text-slate-800 mb-2">Tensor B [4]</span>
              <div className="flex bg-white border border-slate-800">
                <div className="w-12 h-8 flex items-center justify-center border border-slate-300 text-xs font-mono">B1</div>
                <div className="w-12 h-8 flex items-center justify-center border border-slate-300 text-xs font-mono">B2</div>
                <div className="w-12 h-8 flex items-center justify-center border border-slate-300 text-xs font-mono">B3</div>
                <div className="w-12 h-8 flex items-center justify-center border border-slate-300 text-xs font-mono">B4</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Expand */}
        {step === 2 && (
          <div className="bg-[#aef5ce] p-6 rounded border border-slate-400 shadow-sm flex items-center gap-8 animate-in fade-in zoom-in-95">
            <div className="flex flex-col items-center">
               <span className="text-xs font-bold text-slate-800 mb-2">Expanded A [3, 4]</span>
               <div className="grid grid-cols-4 gap-0 bg-[#e7beff] border border-slate-800 p-1">
                 {[...Array(3)].map((_, r) => (
                   <React.Fragment key={r}>
                     {[...Array(4)].map((_, c) => (
                       <div key={c} className="w-12 h-8 flex items-center justify-center border border-slate-800 text-xs font-mono">A{r+1}</div>
                     ))}
                   </React.Fragment>
                 ))}
               </div>
            </div>
            
            <div className="text-2xl font-bold text-emerald-700">+</div>

            <div className="flex flex-col items-center">
               <span className="text-xs font-bold text-slate-800 mb-2">Expanded B [3, 4]</span>
               <div className="grid grid-cols-4 gap-0 bg-[#b1c3ff] border border-slate-800 p-1">
                 {[...Array(3)].map((_, r) => (
                   <React.Fragment key={r}>
                     {[...Array(4)].map((_, c) => (
                       <div key={c} className="w-12 h-8 flex items-center justify-center border border-slate-800 text-xs font-mono">B{c+1}</div>
                     ))}
                   </React.Fragment>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && (
          <div className="bg-[#aef5ce] p-8 rounded border border-slate-400 shadow-md flex flex-col items-center animate-in slide-in-from-bottom-4 scale-110">
            <span className="text-sm font-bold text-slate-800 mb-4">Result [3, 4]</span>
            <div className="grid grid-cols-4 gap-0 border-2 border-slate-800 bg-[#c8f7d9]">
               {[...Array(3)].map((_, r) => (
                 <React.Fragment key={r}>
                   {[...Array(4)].map((_, c) => (
                     <div key={c} className="w-16 h-10 flex items-center justify-center border border-slate-800 text-xs font-mono font-bold text-emerald-900">
                       A{r+1}+B{c+1}
                     </div>
                   ))}
                 </React.Fragment>
               ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function IncompatibleSlide() {
  const pyCode = `# Tensor A: Shape [2, 3]\na = torch.tensor([[1, 2, 3], \n                  [4, 5, 6]])\n\n# Tensor B: Shape [2]\nb = torch.tensor([10, 20])\n\ntry:\n    c = a + b\nexcept RuntimeError as e:\n    print(f"Error: {e}")`;
  const outCode = `Error: The size of tensor a (3) must match the size of tensor b (2) at non-singleton dimension 1`;

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4 text-rose-600">Why shapes fail to broadcast</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          Broadcasting only fails when right-aligned dimensions are not <strong>equal</strong>, and neither of them is a <strong>1</strong>.
        </p>

        {/* The Comparison Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 shadow-sm">
           <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
             <Info size={16} /> Wait, why did [5,4,1] + [4,3] work?
           </h4>
           <p className="text-xs text-blue-800 leading-relaxed mb-3">
             Because alignment happens <strong>strictly from the right edge</strong>. The missing leading dimension in <code>[4,3]</code> is padded with a <code>1</code>.
           </p>
           <div className="font-mono text-[11px] bg-white p-2 rounded border border-blue-100 grid grid-cols-4 text-center">
              <div className="text-right pr-2 text-slate-400 border-r">Tensor A:<br/>Padded B:</div>
              <div>Dim 0<br/><strong>5</strong><br/><span className="text-slate-400">(1)</span></div>
              <div>Dim 1<br/><strong>4</strong><br/><strong>4</strong></div>
              <div>Dim 2<br/><strong>1</strong><br/><strong>3</strong></div>
           </div>
           <p className="text-[10px] text-blue-800 mt-2 text-center font-bold">Every pair matches or has a 1!</p>
        </div>

        {/* The Error Box */}
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col items-center justify-center mb-6">
           <h4 className="text-sm font-bold text-rose-900 mb-2 w-full text-left flex items-center gap-2">
             <AlertTriangle size={16} /> Why [2,3] + [2] fails:
           </h4>
           <div className="font-mono text-[11px] bg-white p-2 w-full rounded border border-rose-100 grid grid-cols-3 text-center mb-2 shadow-sm">
              <div className="text-right pr-2 text-slate-400 border-r">Tensor A:<br/>Padded B:</div>
              <div>Dim 0<br/><strong>2</strong><br/><span className="text-slate-400">(1)</span></div>
              <div className="bg-rose-100 text-rose-900 font-bold border border-rose-300 rounded">Dim 1<br/>3<br/>2</div>
           </div>
           <div className="text-[11px] text-rose-600 font-bold text-center mt-1">
             Mismatch at Dim 1! 3 ≠ 2 (and neither is 1).
           </div>
        </div>

      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[300px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-rose-400 max-h-[200px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} /> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{outCode}</pre>
        </div>
      </div>
    </div>
  );
}