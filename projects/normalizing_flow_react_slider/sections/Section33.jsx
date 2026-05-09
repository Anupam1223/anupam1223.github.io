import { ArrowDown, ArrowRight } from 'lucide-react';

export const meta = {
  title: "33. The Brain vs. The Muscle (Coupling)",
  subtitle: "The neural network finishes completely before the math starts.",
};

export default function Section33() {
  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-gray-700">
        <strong>No, we do not warp X₂ inside the hidden layers!</strong> The entire Neural Network acts as a single, isolated "Brain." X₁ goes all the way through every hidden layer first to produce the final s and t.
      </p>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center mt-4 relative">
        
        <div className="flex w-full items-stretch justify-between gap-4">
            {/* The Brain */}
            <div className="flex-1 bg-slate-900 p-4 pt-6 rounded-xl border border-slate-700 shadow-lg relative flex flex-col items-center">
                <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest mb-3 absolute top-0 -translate-y-1/2 border border-slate-600">1. The Brain (Neural Network)</span>
                <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded mb-2">Input: X₁</div>
                <ArrowDown size={14} className="text-slate-500 mb-1"/>
                <div className="flex gap-2">
                   <div className="bg-slate-800 border border-slate-600 w-8 h-8 rounded-full flex items-center justify-center text-[10px] text-slate-400">L1</div>
                   <div className="bg-slate-800 border border-slate-600 w-8 h-8 rounded-full flex items-center justify-center text-[10px] text-slate-400">L2</div>
                   <div className="bg-slate-800 border border-slate-600 w-8 h-8 rounded-full flex items-center justify-center text-[10px] text-slate-400">L3</div>
                </div>
                <ArrowDown size={14} className="text-slate-500 mt-1 mb-2"/>
                <div className="flex gap-2 w-full justify-center">
                    <div className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded shadow">Output: t</div>
                    <div className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded shadow">Output: s</div>
                </div>
            </div>

            <div className="flex items-center justify-center">
               <ArrowRight size={24} className="text-gray-400"/>
            </div>

            {/* The Muscle */}
            <div className="flex-1 bg-rose-50 p-4 pt-6 rounded-xl border border-rose-200 shadow-sm relative flex flex-col items-center justify-center">
                <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest mb-3 absolute top-0 -translate-y-1/2 border border-rose-300">2. The Muscle (Math)</span>
                <div className="flex items-center gap-2 mb-3">
                   <div className="bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded shadow-sm">Input: X₂</div>
                   <span className="text-rose-400 font-bold">+</span>
                   <div className="flex gap-1">
                      <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">t</span>
                      <span className="bg-teal-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">s</span>
                   </div>
                </div>
                <ArrowDown size={14} className="text-rose-400 mb-2"/>
                <code className="bg-white border border-rose-300 text-rose-800 font-bold px-4 py-2 rounded-lg shadow-sm">
                   Y₂ = (X₂ ⊙ exp(s)) + t
                </code>
            </div>
        </div>

      </div>

      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded text-sm text-indigo-900 shadow-sm mt-4">
        Only <strong>after</strong> the Neural Network completely finishes calculating does it pass the final <code>s</code> and <code>t</code> vectors to the Affine Math block, which executes exactly <strong>once</strong> for that Flow Layer.
      </div>
    </div>
  );
}
