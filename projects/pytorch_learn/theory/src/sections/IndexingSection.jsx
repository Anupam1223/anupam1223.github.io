import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Code, Terminal, AlertTriangle, Play, CheckCircle2 } from 'lucide-react';

export default function IndexingSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { id: 'basic', title: 'Basic Indexing', component: BasicIndexingSlide },
    { id: 'slicing', title: 'Slicing Tensors', component: SlicingSlide },
    { id: 'boolean', title: 'Boolean Masking', component: MaskingSlide },
    { id: 'array', title: 'Integer Array Indexing', component: ArrayIndexingSlide },
  ];
  const CurrentComponent = slides[currentSlide].component;
  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <h2 className="text-2xl font-bold mb-2">Tensor Indexing & Slicing</h2>
        <div className="flex gap-2 mb-2">{slides.map((_, idx) => (<div key={idx} onClick={() => setCurrentSlide(idx)} className={`h-2 flex-1 rounded-full cursor-pointer transition-all duration-300 ${idx === currentSlide ? 'bg-fuchsia-500' : 'bg-slate-700'}`} />))}</div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest">{slides.map((slide, idx) => (<span key={idx} className={idx === currentSlide ? 'text-fuchsia-400' : ''}>{slide.title.toUpperCase()}</span>))}</div>
      </div>
      <div className="min-h-[550px] flex flex-col">
        <div className="flex-1"><CurrentComponent /></div>
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
          <button onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))} disabled={currentSlide === 0} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 disabled:opacity-50 font-semibold transition-colors"><ChevronLeft size={20} /></button>
          <button onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))} disabled={currentSlide === slides.length - 1} className="px-5 py-2.5 rounded-xl bg-fuchsia-600 text-white disabled:opacity-50 font-semibold transition-colors"><ChevronRight size={20} /></button>
        </div>
      </div>
    </div>
  );
}

function BasicIndexingSlide() {
  const [view, setView] = useState('1d'); 
  const grid2d = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const grid1d = [10, 11, 12, 13, 14];

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Basic Indexing</h3>
        <div className="space-y-3 mb-6">
          <button onClick={() => setView('1d')} className={`w-full text-left px-4 py-3 rounded-xl border-2 flex items-center justify-between ${view === '1d' ? 'border-fuchsia-500 bg-fuchsia-50 text-fuchsia-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span>1D Tensor Access</span>{view === '1d' && <CheckCircle2 size={18} className="text-fuchsia-500" />}</button>
          <button onClick={() => setView('2d')} className={`w-full text-left px-4 py-3 rounded-xl border-2 flex items-center justify-between ${view === '2d' ? 'border-fuchsia-500 bg-fuchsia-50 text-fuchsia-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span>2D matrix Access</span>{view === '2d' && <CheckCircle2 size={18} className="text-fuchsia-500" />}</button>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden flex-1 min-h-[220px]">
          {view === '1d' ? (
            <div className="flex gap-2 p-3 bg-white rounded-xl shadow-sm border">
              {grid1d.map((val, idx) => (<div key={idx} className={`w-10 h-10 flex flex-col items-center justify-center font-mono text-sm font-bold rounded-lg transition-all duration-500 ${idx === 1 ? 'bg-fuchsia-500 text-white scale-110 shadow-md ring-2 ring-fuchsia-300' : 'bg-slate-100 text-slate-500'}`}>{idx === 1 ? '110' : val}</div>))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 p-3 bg-white rounded-xl shadow-sm border relative mt-2">
              <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-around text-[10px] font-bold text-slate-300"><span>R0</span><span>R1</span><span>R2</span></div>
              <div className="absolute -top-5 left-0 right-0 flex justify-around text-[10px] font-bold text-slate-300"><span>C0</span><span>C1</span><span>C2</span></div>
              {grid2d.map((val, idx) => {
                const isActive = (Math.floor(idx / 3) === 1 && idx % 3 === 1);
                return (<div key={idx} className={`w-10 h-10 flex items-center justify-center font-mono text-sm font-bold rounded-lg transition-all duration-500 ${isActive ? 'bg-fuchsia-500 text-white scale-110 shadow-lg ring-2 ring-fuchsia-300' : 'bg-slate-100 text-slate-400'}`}>{isActive ? '55' : val}</div>);
              })}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[250px]"><div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
<pre className="whitespace-pre-wrap leading-relaxed text-emerald-100">
{view === '1d' ? (
`import torch
# Create a 1D tensor
x_1d = torch.tensor([10, 11, 12, 13, 14])
first = x_1d[0]
last = x_1d[-1]
x_1d[1] = 110`
) : (
`x_2d = torch.tensor([[1, 2, 3],
                     [4, 5, 6],
                     [7, 8, 9]])
element_0_1 = x_2d[0, 1]
first_row = x_2d[0]
second_col = x_2d[:, 1]
x_2d[1, 1] = 55`
)}
</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[250px] overflow-y-auto"><div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} /> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
<pre className="whitespace-pre-wrap">
{view === '1d' ? (
`tensor([10, 110, 12, 13, 14])`
) : (
`element: 2
modified:
tensor([[ 1,  2,  3],
        [ 4, 55,  6],
        [ 7,  8,  9]])`
)}
</pre>
        </div>
      </div>
    </div>
  );
}

function SlicingSlide() {
  const [view, setView] = useState('1d'); 
  const [step, setStep] = useState(0);

  useEffect(() => {
    let t1, t2; setStep(0);
    t1 = setTimeout(() => setStep(1), 600);
    t2 = setTimeout(() => setStep(2), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [view]);

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Slicing Tensors</h3>
        <div className="space-y-2 mb-6">
          {['1d', '2d', 'memory'].map(v => (<button key={v} onClick={() => setView(v)} className={`w-full text-left px-4 py-3 rounded-xl border-2 text-xs font-bold transition-all flex items-center justify-between ${view === v ? 'bg-fuchsia-50 border-fuchsia-500 text-fuchsia-900' : 'bg-white text-slate-600'}`}><span>{v.toUpperCase()} {v==='memory'?'Warning':'Slicing'}</span>{view===v && <Play size={16} className="text-fuchsia-500"/>}</button>))}
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center flex-1 min-h-[180px]">
          {view === '1d' && (<div className="flex flex-col items-center gap-4"><div className="flex gap-1">{[0,1,2,3,4,5,6,7,8,9].map(i=>(<div key={i} className={`w-6 h-6 flex items-center justify-center font-mono text-[10px] rounded border transition-all duration-500 ${step>=1 && i>=2 && i<5 ? 'bg-fuchsia-500 text-white scale-110 shadow-md ring-2 ring-fuchsia-200' : 'bg-white text-slate-300'}`}>{i}</div>))}</div>{step===2 && <div className="text-[10px] font-bold text-fuchsia-600 animate-bounce">tensor([2, 3, 4])</div>}</div>)}
          {view === '2d' && (<div className="flex flex-col items-center gap-4"><div className="grid grid-cols-4 gap-1">{[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>{const r=Math.floor(i/4),c=i%4,active=r<2 && c>=1 && c<3; return (<div key={i} className={`w-6 h-6 flex items-center justify-center font-mono text-[10px] rounded border transition-all duration-500 ${step>=1 && active ? 'bg-fuchsia-500 text-white scale-110 shadow-md ring-2 ring-fuchsia-200' : 'bg-white text-slate-300'}`}>{i}</div>)})}</div>{step===2 && <div className="text-[10px] font-bold text-fuchsia-600 animate-bounce">tensor([[1, 2], [5, 6]])</div>}</div>)}
          {view === 'memory' && <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-200"><AlertTriangle className="mx-auto mb-2 text-amber-600" /> <p className="text-[10px] text-amber-800 font-bold leading-relaxed">Slices are views! Modifying the slice modifies the original.</p></div>}
        </div>
      </div>
      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[250px] text-emerald-100">
<pre className="whitespace-pre-wrap leading-relaxed">
{view === '1d' ? (
`y_1d = torch.arange(10)
slice1 = y_1d[2:5]
slice4 = y_1d[::2]
slice6 = y_1d.flip(dims=[0])`
) : view === '2d' ? (
`x_2d = torch.tensor([[ 0,  1,  2,  3],
                     [ 4,  5,  6,  7],
                     [ 8,  9, 10, 11]])

sub_tensor1 = x_2d[0:2, 1:3]
sub_tensor2 = x_2d[:, -2:]`
) : (
`sub_tensor = x_2d[0:2, 1:3]
sub_tensor[0, 0] = 101
print(f"Original x_2d after modifying slice:\\n{x_2d}")`
)}
</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 overflow-y-auto max-h-[200px]">
<pre className="whitespace-pre-wrap">
{view === '1d' ? (
`y_1d[2:5]: tensor([2, 3, 4])\ny_1d[::2]: tensor([0, 2, 4, 6, 8])`
) : view === '2d' ? (
`x_2d[0:2, 1:3]: tensor([[1, 2], [5, 6]])`
) : (
`tensor([[  0, 101,   2,   3], [  4,   5,   6,   7], ...])`
)}
</pre>
        </div>
      </div>
    </div>
  );
}

function MaskingSlide() {
  const [view, setView] = useState('filter');
  const [step, setStep] = useState(0);

  useEffect(() => {
    let t1, t2; setStep(0);
    t1 = setTimeout(() => setStep(1), 800);
    t2 = setTimeout(() => setStep(2), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [view]);

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Boolean Masking</h3>
        <div className="space-y-2 mb-6">
          <button onClick={() => setView('filter')} className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-between ${view === 'filter' ? 'border-fuchsia-50 bg-fuchsia-50 text-fuchsia-900 font-bold' : 'bg-white text-slate-600'}`}><span>Filter Data (data &gt; 3)</span>{view === 'filter' && <CheckCircle2 size={18} className="text-fuchsia-500"/>}</button>
          <button onClick={() => setView('rows')} className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-between ${view === 'rows' ? 'border-fuchsia-50 bg-fuchsia-50 text-fuchsia-900 font-bold' : 'bg-white text-slate-600'}`}><span>Row Masking (Col 0 &gt; 2)</span>{view === 'rows' && <CheckCircle2 size={18} className="text-fuchsia-500"/>}</button>
        </div>
        <div className="bg-slate-50 border rounded-2xl p-4 flex flex-col items-center justify-center flex-1 min-h-[200px]">
          <div className="grid grid-cols-2 gap-1.5">{[1,2,3,4,5,6].map((v, i) => {
            const r=Math.floor(i/2);
            const isMatch = view === 'filter' ? v > 3 : r > 0;
            return (<div key={i} className={`w-10 h-10 rounded-md flex items-center justify-center font-mono text-xs font-bold transition-all duration-500 ${step>=1 && isMatch ? 'bg-emerald-400 text-white scale-110 shadow ring-2 ring-emerald-200' : 'bg-white border text-slate-300'}`}>{step===1 ? (isMatch?'T':'F') : v}</div>)
          })}</div>
        </div>
      </div>
      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[250px] text-emerald-100">
<pre className="whitespace-pre-wrap leading-relaxed">
{view === 'filter' ? (
`data = torch.tensor([[1, 2], [3, 4], [5, 6]])
mask = data > 3
selected_elements = data[mask]

data[data <= 3] = 0`
) : (
`row_mask = data[:, 0] > 2
selected_rows = data[row_mask, :]`
)}
</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 overflow-y-auto max-h-[200px]">
<pre className="whitespace-pre-wrap">
{view === 'filter' ? (
`Selected elements: tensor([4, 5, 6])
Modified data: tensor([[0, 0], [0, 4], [5, 6]])`
) : (
`Selected rows: tensor([[3, 4], [5, 6]])`
)}
</pre>
        </div>
      </div>
    </div>
  );
}

function ArrayIndexingSlide() {
  const [view, setView] = useState('1d');
  const [step, setStep] = useState(0);

  useEffect(() => {
    let t1, t2; setStep(0);
    t1 = setTimeout(() => setStep(1), 800);
    t2 = setTimeout(() => setStep(2), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [view]);

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Array Indexing</h3>
        <div className="space-y-2 mb-6">
          <button onClick={() => setView('1d')} className={`w-full text-left px-4 py-3 rounded-xl border-2 text-xs font-bold transition-all flex items-center justify-between ${view === '1d' ? 'bg-fuchsia-50 border-fuchsia-500 text-fuchsia-900' : 'bg-white text-slate-600'}`}><span>1D: Repeated Indices</span>{view === '1d' && <CheckCircle2 size={18} className="text-fuchsia-500"/>}</button>
          <button onClick={() => setView('2d_coords')} className={`w-full text-left px-4 py-3 rounded-xl border-2 text-xs font-bold transition-all flex items-center justify-between ${view === '2d_coords' ? 'bg-fuchsia-50 border-fuchsia-500 text-fuchsia-900' : 'bg-white text-slate-600'}`}><span>2D: Coordinate Pairs</span>{view === '2d_coords' && <CheckCircle2 size={18} className="text-fuchsia-500"/>}</button>
        </div>
        <div className="bg-slate-50 border rounded-2xl p-4 flex flex-col items-center justify-center flex-1 min-h-[200px]">
          {view === '1d' ? (
            <div className="flex gap-1">{[10,11,12,13,14].map((v, i) => (<div key={i} className={`w-8 h-8 rounded-md border flex items-center justify-center font-mono text-[10px] font-bold transition-all duration-500 ${step>=1 && [0,4,2].includes(i) ? 'bg-blue-400 text-white scale-110 shadow ring-2 ring-blue-200' : 'bg-white text-slate-300'}`}>{v}</div>))}</div>
          ) : (
            <div className="grid grid-cols-4 gap-1">{[0,1,2,3,4,5,6,7,8,9,10,11].map(i => { const r=Math.floor(i/4),c=i%4,active=(r===0&&c===1)||(r===1&&c===3)||(r===2&&c===0); return (<div key={i} className={`w-7 h-7 rounded-md border flex items-center justify-center font-mono text-[10px] font-bold transition-all duration-500 ${step>=1 && active ? 'bg-amber-400 text-slate-900 scale-110 shadow ring-2 ring-amber-200' : 'bg-white text-slate-300'}`}>{i}</div>)})}</div>
          )}
          {step === 2 && <div className="mt-4 text-[10px] font-bold text-fuchsia-600 animate-bounce">{view === '1d' ? 'tensor([10, 14, 12, 12])' : 'tensor([1, 7, 8])'}</div>}
        </div>
      </div>
      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[250px] text-emerald-100">
<pre className="whitespace-pre-wrap leading-relaxed">
{view === '1d' ? (
`x = torch.arange(10, 20) 
indices = torch.tensor([0, 4, 2, 2])
selected = x[indices]`
) : (
`y = torch.arange(12).reshape(3, 4)
row_idx = torch.tensor([0, 1, 2])
col_idx = torch.tensor([1, 3, 0])

selected_elements = y[row_idx, col_idx]`
)}
</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 overflow-y-auto max-h-[200px]">
<pre className="whitespace-pre-wrap">
{view === '1d' ? (
`Selected elements: tensor([10, 14, 12, 12])`
) : (
`Selected specific elements: tensor([1, 7, 8])`
)}
</pre>
        </div>
      </div>
    </div>
  );
}