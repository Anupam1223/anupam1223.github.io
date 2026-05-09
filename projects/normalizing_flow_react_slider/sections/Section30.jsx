import { ArrowDown, ArrowRight, Zap } from 'lucide-react';

export const meta = {
  title: "30. The Lightning-Fast Inverse",
  subtitle: "Why sampling is instant (No For Loops!).",
};

export default function Section30() {
  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-gray-700">
        For Model Predictive Control, we need to generate thousands of states instantly. Because Half A (X₁) passed through untouched, it is our key to reversing the entire layer in a single pass.
      </p>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative mt-4">
         <h4 className="text-slate-800 text-center font-bold mb-6">The Inverse Transformation (Sampling)</h4>
         
         <div className="flex items-start justify-center gap-12 relative z-10">
            {/* Left Side */}
            <div className="flex flex-col items-center gap-4 w-1/3">
               <div className="bg-blue-400 text-white px-6 py-2 rounded shadow font-mono w-full text-center">Y₁</div>
               
               <div className="h-32 w-1 bg-blue-300/50 relative">
                 <ArrowDown size={16} className="absolute -left-1.5 bottom-0 text-blue-400"/>
               </div>
               
               <div className="bg-blue-500 text-white px-6 py-2 rounded shadow-lg font-mono w-full text-center border-2 border-blue-400 flex flex-col">
                 <span className="font-bold text-xs mb-1">X₁</span>
                 <span className="text-[10px]">X₁ = Y₁</span>
               </div>
            </div>

            {/* The Network Bridge */}
            <div className="absolute left-[35%] top-[25%] flex items-center">
               <div className="w-16 h-1 bg-blue-500/50 relative">
                 <ArrowRight size={14} className="absolute -right-1 -top-1.5 text-blue-500"/>
               </div>
               <div className="bg-emerald-100 text-emerald-800 p-3 rounded-lg border-2 border-emerald-400 shadow text-center text-xs font-bold relative">
                 <span className="absolute -top-3 -right-3 flex h-5 w-5">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 text-white items-center justify-center text-[10px]"><Zap size={10}/></span>
                 </span>
                 Standard NN<br/><span className="text-[10px] text-emerald-600 font-mono mt-1 block">s(Y₁), t(Y₁)</span>
               </div>
               <div className="w-16 h-1 bg-emerald-400/50 relative">
                 <div className="absolute right-0 -top-1 border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-emerald-500"></div>
               </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-col items-center gap-4 w-1/3">
               <div className="bg-rose-400 text-white px-6 py-2 rounded shadow font-mono w-full text-center">Y₂</div>
               
               <div className="h-12 w-1 bg-rose-300/50"></div>
               
               <div className="bg-slate-100 text-slate-800 font-bold p-3 rounded border border-slate-300 shadow flex items-center justify-center">
                 <span className="text-xs">Inverse Affine</span>
               </div>

               <div className="h-8 w-1 bg-rose-500/50 relative">
                  <ArrowDown size={16} className="absolute -left-1.5 bottom-0 text-rose-500"/>
               </div>
               
               <div className="bg-rose-500 text-white px-2 py-2 rounded shadow-lg font-mono w-full text-center text-[9px] border-2 border-rose-400 flex flex-col">
                 <span className="font-bold text-xs mb-1">X₂</span>
                 <span>(Y₂ - t) ⊙ exp(-s)</span>
               </div>
            </div>
         </div>

         <div className="mt-8 bg-emerald-50 border border-emerald-200 p-4 rounded-lg text-sm text-emerald-900 text-center shadow-inner">
           Because Y₁ is instantly available, we can run the Neural Network to get the exact same s and t parameters <strong>in one single pass</strong>. There are no sequential loops! This makes Affine Coupling perfectly suited for fast, real-time Model Predictive Control simulations.
         </div>
      </div>
    </div>
  );
}
