import React, { useState } from 'react';
import { 
  Maximize, ChevronLeft, ChevronRight, Code, Terminal, 
  AlertTriangle, Play, CheckCircle2, ArrowRight 
} from 'lucide-react';

export default function ReshapeSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'view', title: 'view() & Inference', component: ViewSlide },
    { id: 'reshape', title: 'reshape() & Contiguity', component: ReshapeSlide },
    { id: 'permute', title: 'permute() Dimensions', component: PermuteSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Maximize size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Reshaping & Rearranging Tensors</h2>
        <p className="text-slate-400 text-sm mb-4">view(), reshape(), and permute()</p>
        
        <div className="flex gap-2 mb-2">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-cyan-400' : ''}>
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
            className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white disabled:opacity-50 font-semibold transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewSlide() {
  const [view, setView] = useState('3x4');
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  const explanations = {
    '3x4': <span><strong>view()</strong> rearranges the 12 elements into 3 rows and 4 columns. Memory isn't copied; PyTorch just changes how it reads the original flat array.</span>,
    '2x6': <span>Because the total elements (12) match, changing the shape to 2x6 is instant and shares the original memory.</span>,
    'infer': <span>By passing <strong>-1</strong>, you tell PyTorch: "Figure out this dimension." Since we asked for a <code>2x2x?</code> tensor with 12 elements, PyTorch calculates the missing dimension must be 3 (12 / 4 = 3).</span>
  };

  const pyCode = {
    '3x4': `import torch\n# Create a contiguous tensor\nx = torch.arange(12)\nprint(f"Original tensor: {x}")\nprint(f"Original shape: {x.shape}")\nprint(f"Is contiguous? {x.is_contiguous()}")\n\n# Reshape using view()\ny = x.view(3, 4)\nprint("\\nTensor after view(3, 4):")\nprint(y)\nprint(f"New shape: {y.shape}")\nprint(f"Shares storage with x? {y.storage().data_ptr() == x.storage().data_ptr()}")\nprint(f"Is y contiguous? {y.is_contiguous()}")`,
    '2x6': `# Try another view\nz = y.view(2, 6)\nprint("\\nTensor after view(2, 6):")\nprint(z)\nprint(f"New shape: {z.shape}")\nprint(f"Shares storage with x? {z.storage().data_ptr() == x.storage().data_ptr()}")\nprint(f"Is z contiguous? {z.is_contiguous()}")`,
    'infer': `# Using -1 for inference\nw = x.view(2, 2, -1) # Infers the last dimension to be 3 (12 / (2*2) = 3)\nprint("\\nTensor after view(2, 2, -1):")\nprint(w)\nprint(f"New shape: {w.shape}")`
  };

  const outCode = {
    '3x4': `Original tensor: tensor([ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11])\nOriginal shape: torch.Size([12])\nIs contiguous? True\n\nTensor after view(3, 4):\ntensor([[ 0,  1,  2,  3],\n        [ 4,  5,  6,  7],\n        [ 8,  9, 10, 11]])\nNew shape: torch.Size([3, 4])\nShares storage with x? True\nIs y contiguous? True`,
    '2x6': `Tensor after view(2, 6):\ntensor([[ 0,  1,  2,  3,  4,  5],\n        [ 6,  7,  8,  9, 10, 11]])\nNew shape: torch.Size([2, 6])\nShares storage with x? True\nIs z contiguous? True`,
    'infer': `Tensor after view(2, 2, -1):\ntensor([[[ 0,  1,  2],\n         [ 3,  4,  5]],\n\n        [[ 6,  7,  8],\n         [ 9, 10, 11]]])\nNew shape: torch.Size([2, 2, 3])`
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Changing Shape with view()</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          <code>view()</code> changes dimensions without copying data, returning a tensor that shares storage. However, it requires the tensor to be <strong>contiguous</strong> in memory.
        </p>
        
        <div className="space-y-2 mb-4">
          <button onClick={() => setView('3x4')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === '3x4' ? 'border-cyan-500 bg-cyan-50 text-cyan-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span>x.view(3, 4)</span>{view === '3x4' && <CheckCircle2 size={16} className="text-cyan-500" />}</button>
          <button onClick={() => setView('2x6')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === '2x6' ? 'border-cyan-500 bg-cyan-50 text-cyan-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span>y.view(2, 6)</span>{view === '2x6' && <CheckCircle2 size={16} className="text-cyan-500" />}</button>
          <button onClick={() => setView('infer')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'infer' ? 'border-cyan-500 bg-cyan-50 text-cyan-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span>x.view(2, 2, -1) (Inference)</span>{view === 'infer' && <CheckCircle2 size={16} className="text-cyan-500" />}</button>
        </div>

        <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs p-3 rounded-lg mb-4 shadow-sm leading-relaxed animate-in fade-in">
          {explanations[view]}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center flex-1 min-h-[220px]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Visualizing Shape</p>
          
          <div className={`transition-all duration-500 grid gap-1 ${
            view === '3x4' ? 'grid-cols-4' : 
            view === '2x6' ? 'grid-cols-6' : 
            'grid-cols-3'
          }`}>
            {arr.map((val) => {
              const isSplit = view === 'infer' && val === 5;
              return (
                <div key={val} className={`w-8 h-8 flex items-center justify-center font-mono text-sm font-bold rounded-lg bg-cyan-500 text-white shadow-md ${isSplit ? 'mb-4' : ''}`}>
                  {val}
                </div>
              );
            })}
          </div>
          {view === 'infer' && <p className="text-[10px] text-cyan-600 font-bold mt-4 uppercase animate-pulse">Dim inferred as 3: (12 / (2*2))</p>}
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

function ReshapeSlide() {
  const [view, setView] = useState('transpose');

  const explanations = {
    'transpose': <span>A tensor is <strong>contiguous</strong> if its elements are stored in a single, unbroken block of memory. <strong>Transposing</strong> (swapping rows/cols) breaks this neat order, making it non-contiguous.</span>,
    'error': <span><strong>view()</strong> strictly requires contiguous memory to work. Since our transposed tensor has a mixed-up memory layout, calling <code>view()</code> triggers a RuntimeError.</span>,
    'reshape': <span><strong>reshape()</strong> is smarter. If the tensor is non-contiguous, it automatically <strong>copies the data into a brand new, freshly ordered memory block</strong>, preventing the error.</span>,
    'infer': <span>Just like <code>view()</code>, <code>reshape()</code> supports passing <strong>-1</strong> to automatically calculate a missing dimension's size.</span>
  };

  const pyCode = {
    'transpose': `# Example of view() failing on a non-contiguous tensor\na = torch.arange(12).view(3, 4)\nb = a.t() # Transpose creates a non-contiguous tensor\n\nprint(f"\\nOriginal non-contiguous tensor b:\\n{b}")\nprint(f"Shape of b: {b.shape}")\nprint(f"Is b contiguous? {b.is_contiguous()}")`,
    'error': `try:\n    c = b.view(12)\nexcept RuntimeError as e:\n    print(f"\\nError trying b.view(12): {e}")`,
    'reshape': `# Reshape works even if 'b' is not contiguous\nc = b.reshape(12)\nprint(f"\\nTensor c after b.reshape(12):\\n{c}")\nprint(f"Shape of c: {c.shape}")\nprint(f"Is c contiguous? {c.is_contiguous()}")\n\n# Check if 'c' shares storage with 'b'\n# It likely won't because reshape probably copied.\nprint(f"Shares storage with b? {c.storage().data_ptr() == b.storage().data_ptr()}")`,
    'infer': `# Reshape can also infer dimensions with -1\nd = b.reshape(2, -1) # Infers the last dimension to be 6\nprint(f"\\nTensor d after b.reshape(2, -1):\\n{d}")\nprint(f"Shape of d: {d.shape}")`
  };

  const outCode = {
    'transpose': `Original non-contiguous tensor b:\ntensor([[ 0,  4,  8],\n        [ 1,  5,  9],\n        [ 2,  6, 10],\n        [ 3,  7, 11]])\nShape of b: torch.Size([4, 3])\nIs b contiguous? False`,
    'error': `Error trying b.view(12): view size is not compatible with input tensor's size and stride (at least one dimension spans across two contiguous subspaces). Use .reshape(...) instead.`,
    'reshape': `Tensor c after b.reshape(12):\ntensor([ 0,  4,  8,  1,  5,  9,  2,  6, 10,  3,  7, 11])\nShape of c: torch.Size([12])\nIs c contiguous? True\nShares storage with b? False`,
    'infer': `Tensor d after b.reshape(2, -1):\ntensor([[ 0,  4,  8,  1,  5,  9],\n        [ 2,  6, 10,  3,  7, 11]])\nShape of d: torch.Size([2, 6])`
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">reshape() & Contiguity</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          <code>reshape()</code> behaves similarly to <code>view()</code>, but if the tensor is non-contiguous, it gracefully <strong>copies</strong> the data into a new block instead of throwing an error.
        </p>

        <div className="space-y-2 mb-4">
          <button onClick={() => setView('transpose')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'transpose' ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span>1. Transpose (Non-contiguous)</span></button>
          <button onClick={() => setView('error')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'error' ? 'border-rose-500 bg-rose-50 text-rose-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span>2. view(12) throws Error</span></button>
          <button onClick={() => setView('reshape')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'reshape' ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span>3. reshape(12) works (Copies)</span></button>
          <button onClick={() => setView('infer')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'infer' ? 'border-cyan-500 bg-cyan-50 text-cyan-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span>4. reshape(2, -1) with Inference</span></button>
        </div>

        <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs p-3 rounded-lg mb-4 shadow-sm leading-relaxed animate-in fade-in">
          {explanations[view]}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center flex-1 min-h-[160px] relative overflow-hidden">
          {view === 'transpose' || view === 'error' ? (
            <div className="relative">
              <div className="grid grid-cols-3 gap-1">
                {[0,4,8, 1,5,9, 2,6,10, 3,7,11].map(val => (
                  <div key={val} className="w-8 h-8 flex items-center justify-center font-mono text-xs font-bold rounded bg-amber-100 text-amber-800 border border-amber-300">
                    {val}
                  </div>
                ))}
              </div>
              {view === 'error' && (
                <div className="absolute inset-0 bg-rose-500/10 backdrop-blur-[1px] flex items-center justify-center rounded-lg animate-in zoom-in-50">
                  <AlertTriangle size={48} className="text-rose-600 drop-shadow-md" />
                </div>
              )}
            </div>
          ) : view === 'reshape' ? (
             <div className="flex gap-1 flex-wrap justify-center w-full px-2">
               {[0,4,8, 1,5,9, 2,6,10, 3,7,11].map(val => (
                 <div key={val} className="w-6 h-6 flex items-center justify-center font-mono text-[10px] font-bold rounded bg-emerald-500 text-white shadow-sm animate-in fade-in zoom-in">
                   {val}
                 </div>
               ))}
               <p className="w-full text-center text-[10px] text-emerald-600 font-bold mt-2 uppercase">New Memory Block Copied</p>
             </div>
          ) : (
             <div className="grid grid-cols-6 gap-1">
               {[0,4,8,1,5,9, 2,6,10,3,7,11].map(val => (
                 <div key={val} className="w-7 h-7 flex items-center justify-center font-mono text-[10px] font-bold rounded bg-cyan-500 text-white shadow-sm animate-in fade-in zoom-in">
                   {val}
                 </div>
               ))}
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

function PermuteSlide() {
  const [view, setView] = useState('hwc');

  const explanations = {
    'hwc': <span><strong>permute()</strong> explicitly swaps axes. Here, we move Channels (dim 0) to the end (dim 2). Like <code>view()</code>, this doesn't copy memory, making the result non-contiguous.</span>,
    'back': <span>Permuting again restores the original shape. The data hasn't moved in memory at all; we just changed how PyTorch traverses it.</span>,
    'flat': <span>Because permute messes up memory contiguity, we often call <strong>.contiguous()</strong> before flattening with <code>.view(-1)</code> to ensure the data is safely copied into a neat 1D line.</span>
  };

  const pyCode = {
    'hwc': `# Create a 3D tensor (e.g., representing C, H, W)\nimage_tensor = torch.randn(3, 32, 32) # Channels, Height, Width\nprint(f"Original shape: {image_tensor.shape}")\n\n# Permute to (Height, Width, Channels)\npermuted_tensor = image_tensor.permute(1, 2, 0)\nprint(f"Permuted shape: {permuted_tensor.shape}")\n\n# Permute usually returns a non-contiguous view\nprint(f"Is permuted_tensor contiguous? {permuted_tensor.is_contiguous()}")`,
    'back': `# Permuting back\noriginal_again = permuted_tensor.permute(2, 0, 1) # Back to C, H, W\nprint(f"Shape after permuting back: {original_again.shape}")\nprint(f"Is original_again contiguous? {original_again.is_contiguous()}")\n\n# Check storage sharing\nprint(f"Shares storage with original? {original_again.storage().data_ptr() == image_tensor.storage().data_ptr()}")`,
    'flat': `# Make the permuted tensor contiguous\ncontiguous_permuted = permuted_tensor.contiguous()\nprint(f"\\nIs contiguous_permuted contiguous? {contiguous_permuted.is_contiguous()}")\n\n# Now view() can be used safely\nflattened_permuted = contiguous_permuted.view(-1)\nprint(f"Shape after flattening: {flattened_permuted.shape}")`
  };

  const outCode = {
    'hwc': `Original shape: torch.Size([3, 32, 32])\nPermuted shape: torch.Size([32, 32, 3])\nIs permuted_tensor contiguous? False`,
    'back': `Shape after permuting back: torch.Size([3, 32, 32])\nIs original_again contiguous? False\nShares storage with original? True`,
    'flat': `Is contiguous_permuted contiguous? True\nShape after flattening: torch.Size([3072])`
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold mb-4">Rearranging with permute()</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          <code>permute()</code> explicitly swaps axes without copying data. It is widely used to convert between PyTorch's default Image format (C, H, W) and standard visualization formats like Matplotlib's (H, W, C).
        </p>

        <div className="space-y-2 mb-4">
          <button onClick={() => setView('hwc')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'hwc' ? 'border-cyan-500 bg-cyan-50 text-cyan-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span>1. Permute to (H, W, C)</span></button>
          <button onClick={() => setView('back')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'back' ? 'border-cyan-500 bg-cyan-50 text-cyan-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span>2. Permute back to (C, H, W)</span></button>
          <button onClick={() => setView('flat')} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center justify-between transition-all ${view === 'flat' ? 'border-cyan-500 bg-cyan-50 text-cyan-900 font-bold' : 'border-slate-200 text-slate-600'}`}><span>3. Make contiguous() and Flatten</span></button>
        </div>

        <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs p-3 rounded-lg mb-4 shadow-sm leading-relaxed animate-in fade-in">
          {explanations[view]}
        </div>

        <div className="bg-slate-50 border rounded-2xl p-4 flex flex-col items-center justify-center flex-1 min-h-[160px]">
          {view === 'hwc' ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-2">
                <div className="w-12 h-12 bg-red-100 border-2 border-red-500 text-red-700 rounded-lg flex items-center justify-center font-bold">C</div>
                <div className="w-12 h-12 bg-green-100 border-2 border-green-500 text-green-700 rounded-lg flex items-center justify-center font-bold">H</div>
                <div className="w-12 h-12 bg-blue-100 border-2 border-blue-500 text-blue-700 rounded-lg flex items-center justify-center font-bold">W</div>
              </div>
              <ArrowRight size={20} className="text-slate-300" />
              <div className="flex gap-2">
                <div className="w-12 h-12 bg-green-100 border-2 border-green-500 text-green-700 rounded-lg flex items-center justify-center font-bold shadow-md">H</div>
                <div className="w-12 h-12 bg-blue-100 border-2 border-blue-500 text-blue-700 rounded-lg flex items-center justify-center font-bold shadow-md">W</div>
                <div className="w-12 h-12 bg-red-100 border-2 border-red-500 text-red-700 rounded-lg flex items-center justify-center font-bold shadow-md">C</div>
              </div>
            </div>
          ) : view === 'back' ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-2">
                <div className="w-12 h-12 bg-red-100 border-2 border-red-500 text-red-700 rounded-lg flex items-center justify-center font-bold shadow-md">C</div>
                <div className="w-12 h-12 bg-green-100 border-2 border-green-500 text-green-700 rounded-lg flex items-center justify-center font-bold shadow-md">H</div>
                <div className="w-12 h-12 bg-blue-100 border-2 border-blue-500 text-blue-700 rounded-lg flex items-center justify-center font-bold shadow-md">W</div>
              </div>
              <p className="text-[10px] text-amber-600 font-bold uppercase border border-amber-200 bg-amber-50 px-2 py-1 rounded">Shares Storage: True</p>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full px-4">
              <div className="w-full h-8 bg-gradient-to-r from-red-400 via-green-400 to-blue-400 rounded flex items-center justify-center text-white font-mono text-[10px] font-bold shadow-md">
                [ 3072 Elements Flattened ]
              </div>
              <p className="text-[10px] text-emerald-600 font-bold uppercase mt-4">Made Contiguous & Copied</p>
            </div>
          )}
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