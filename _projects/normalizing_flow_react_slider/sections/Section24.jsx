import { ArrowRight, Zap } from 'lucide-react';

export const meta = {
  title: "24. The Output Trick (μ & α)",
  subtitle: "How one neural network outputs two different things.",
};

export default function Section24() {
  return (
    <div className="space-y-4">
      <p className="text-gray-700 text-sm">
        In Step C of the Flow Layer, MADE outputs two vectors: Means (μ) and Scales (α). How does a single network output two different parameter types? <strong>We just double the output neurons!</strong>
      </p>
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 flex flex-col items-center">
          <h4 className="font-bold text-indigo-800 mb-3 border-b border-indigo-100 pb-1">1. The Doubling Trick</h4>
          <div className="flex items-center gap-2 w-full justify-center">
            <div className="bg-blue-100 p-2 rounded border border-blue-300 text-center text-xs shadow-sm">
              Input<br/><b className="text-blue-800">N Pixels</b>
            </div>
            <ArrowRight size={16} className="text-gray-400" />
            <div className="bg-slate-800 text-white p-3 rounded-lg text-center text-xs shadow-lg border border-slate-600">
              <b className="text-indigo-400">MADE</b><br/>Network
            </div>
            <ArrowRight size={16} className="text-gray-400" />
            <div className="flex flex-col gap-2">
              <div className="bg-rose-50 p-2 rounded border border-rose-300 text-center text-xs shadow-sm">
                <span className="text-[10px] text-gray-500 uppercase block leading-none mb-1">First Half</span>
                <b className="text-rose-700">N μ (Means)</b>
              </div>
              <div className="bg-teal-50 p-2 rounded border border-teal-300 text-center text-xs shadow-sm">
                <span className="text-[10px] text-gray-500 uppercase block leading-none mb-1">Second Half</span>
                <b className="text-teal-700">N α (Scales)</b>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 mt-3 text-center">If we input 100 pixels, we build 200 output neurons and literally just slice the array in half in the code!</p>
        </div>
        <div className="flex-1 flex flex-col items-center md:border-l border-gray-200 md:pl-6">
          <h4 className="font-bold text-rose-800 mb-3 border-b border-rose-100 pb-1">2. Applying the Mask</h4>
          <p className="text-xs text-gray-600 mb-3 text-center">To prevent cheating, both halves must share the exact same masking rules.</p>
          <div className="flex gap-4">
            <div className="text-center bg-rose-50 px-4 py-2 rounded-lg border border-rose-200 shadow-inner">
              <code className="text-rose-700 font-bold text-lg">μ₃</code><br/><span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">Degree m=3</span>
            </div>
            <div className="text-center bg-teal-50 px-4 py-2 rounded-lg border border-teal-200 shadow-inner">
              <code className="text-teal-700 font-bold text-lg">α₃</code><br/><span className="text-[10px] text-teal-600 font-bold uppercase tracking-wider">Degree m=3</span>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 mt-3 text-center">Both the shift (μ₃) and scale (α₃) for Pixel 3 are assigned degree m=3, making them strictly blindfolded to Pixels 3 and beyond!</p>
        </div>
      </div>
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-md text-white mt-2 relative overflow-hidden">
        <h4 className="font-bold text-amber-400 mb-3 border-b border-slate-700 pb-2 flex items-center gap-2"><Zap size={18}/> 3. The Deep Learning "Magic"</h4>
        <p className="text-xs text-slate-300 mb-4 leading-relaxed">When first initialized, these 200 neurons output random garbage. They don't "know" they are Means or Scales! They only learn their identity because of <strong>where we plug them in</strong>:</p>
        <div className="flex justify-center mb-5">
          <code className="bg-slate-800 px-5 py-3 rounded-xl text-lg md:text-xl font-mono border border-slate-600 shadow-inner">
            Z = (X - <span className="text-rose-400">μ</span>) * exp(-<span className="text-teal-400">α</span>)
          </code>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-600 text-xs text-slate-300 leading-relaxed">
            Because the first half is plugged into the <strong>subtraction</strong> slot, the Loss Function mathematically forces those specific neurons to act as <span className="text-rose-400 font-bold">Shift Vectors (Means)</span> to center the data at 0.
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-600 text-xs text-slate-300 leading-relaxed">
            Because the second half is plugged into the <strong>exponent</strong> slot, the Loss Function mathematically forces them to act as <span className="text-teal-400 font-bold">Scale Vectors</span> to squeeze the width.
          </div>
        </div>
      </div>
    </div>
  );
}
