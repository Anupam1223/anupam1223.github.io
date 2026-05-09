import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function DimensionsSection() {
  const [step, setStep] = useState(0);

  const dimensions = [
    {
      title: "Scalar",
      dim: "0D Tensor",
      desc: "A single number. No axes.",
      example: "7",
      visual: <div className="w-12 h-12 bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center font-mono font-bold text-blue-800 text-xl">7</div>
    },
    {
      title: "Vector",
      dim: "1D Tensor",
      desc: "A list or array of numbers. One axis.",
      example: "[1, 2, 3]",
      visual: (
        <div className="flex gap-1">
          {[1, 2, 3].map(n => (
            <div key={n} className="w-10 h-10 bg-indigo-100 border-2 border-indigo-400 rounded flex items-center justify-center font-mono font-bold text-indigo-800">{n}</div>
          ))}
        </div>
      )
    },
    {
      title: "Matrix",
      dim: "2D Tensor",
      desc: "A grid of numbers. Two axes (rows, columns).",
      example: "[[1, 2], [3, 4]]",
      visual: (
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <div className="w-10 h-10 bg-purple-100 border-2 border-purple-400 rounded flex items-center justify-center font-mono font-bold text-purple-800">1</div>
            <div className="w-10 h-10 bg-purple-100 border-2 border-purple-400 rounded flex items-center justify-center font-mono font-bold text-purple-800">2</div>
          </div>
          <div className="flex gap-1">
            <div className="w-10 h-10 bg-purple-100 border-2 border-purple-400 rounded flex items-center justify-center font-mono font-bold text-purple-800">3</div>
            <div className="w-10 h-10 bg-purple-100 border-2 border-purple-400 rounded flex items-center justify-center font-mono font-bold text-purple-800">4</div>
          </div>
        </div>
      )
    },
    {
      title: "3D Tensor",
      dim: "3D Tensor",
      desc: "A cube of numbers. Often used for RGB images (HxWxC).",
      example: "[[[...]]]",
      visual: (
        <div className="relative w-24 h-24">
          <div className="absolute top-4 left-4 w-16 h-16 bg-teal-100/80 border-2 border-teal-400 rounded"></div>
          <div className="absolute top-2 left-2 w-16 h-16 bg-teal-200/80 border-2 border-teal-500 rounded"></div>
          <div className="absolute top-0 left-0 w-16 h-16 bg-teal-300/80 border-2 border-teal-600 rounded flex items-center justify-center font-bold text-teal-900 shadow-sm">RGB</div>
        </div>
      )
    },
    {
      title: "Higher-Dim Tensor",
      dim: "4D+ Tensor",
      desc: "e.g., Batches of images (Batch BxHxWxC).",
      example: "[[[[...]]]]",
      visual: (
        <div className="flex gap-2">
          <div className="relative w-16 h-16">
            <div className="absolute top-2 left-2 w-12 h-12 bg-slate-200 border-2 border-slate-400 rounded"></div>
            <div className="absolute top-0 left-0 w-12 h-12 bg-slate-300 border-2 border-slate-500 rounded flex items-center justify-center font-bold text-xs text-slate-800">Img 1</div>
          </div>
          <div className="relative w-16 h-16">
            <div className="absolute top-2 left-2 w-12 h-12 bg-slate-200 border-2 border-slate-400 rounded"></div>
            <div className="absolute top-0 left-0 w-12 h-12 bg-slate-300 border-2 border-slate-500 rounded flex items-center justify-center font-bold text-xs text-slate-800">Img 2</div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Dimensionality Flow</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 disabled:opacity-50 font-medium"
          >
            Previous
          </button>
          <button 
            onClick={() => setStep(Math.min(dimensions.length - 1, step + 1))}
            disabled={step === dimensions.length - 1}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 font-medium"
          >
            Add Dimension <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-8 border border-slate-200 flex flex-col items-center min-h-[320px] justify-center relative overflow-hidden mb-6">
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-bold text-slate-500 uppercase tracking-wider shadow-sm border border-slate-100">
          {dimensions[step].dim}
        </div>
        
        <div className="transform transition-all duration-500 scale-125 mb-8">
          {dimensions[step].visual}
        </div>
        
        <div className="text-center mt-4">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">{dimensions[step].title}</h3>
          <p className="text-slate-600 mb-3">{dimensions[step].desc}</p>
          <code className="bg-slate-200 px-3 py-1.5 rounded text-sm text-slate-700 font-mono shadow-inner">
            {dimensions[step].example}
          </code>
        </div>
      </div>

      <div className="flex justify-between items-center relative px-4">
        <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full transform -translate-y-1/2"></div>
        <div className="absolute left-0 top-1/2 h-1 bg-blue-500 -z-10 rounded-full transform -translate-y-1/2 transition-all duration-500" style={{ width: `${(step / (dimensions.length - 1)) * 100}%` }}></div>
        
        {dimensions.map((d, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
              i === step 
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-110' 
                : i < step 
                  ? 'bg-blue-100 text-blue-600 border-blue-500 cursor-pointer hover:bg-blue-200' 
                  : 'bg-white text-slate-400 border-slate-300 cursor-pointer hover:border-blue-300'
            }`}
          >
            {i}
          </button>
        ))}
      </div>
    </div>
  );
}
