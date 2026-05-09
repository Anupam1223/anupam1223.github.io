import { ArrowDown, ArrowRight } from 'lucide-react';

export const meta = {
  title: "28. Affine Coupling Layers",
  subtitle: "The 'Lazy' Split Trick.",
};

export default function Section28() {
  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-gray-700">
        Coupling layers completely abandon the strict pixel-by-pixel autoregressive rule. Instead, they simply chop the entire data vector perfectly in half.
      </p>
      
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl relative mt-4">
         <h4 className="text-white text-center font-bold mb-6">The Forward Transformation</h4>
         
         <div className="flex items-start justify-center gap-12 relative z-10">
            {/* Left Side (Pass Through) */}
            <div className="flex flex-col items-center gap-4 w-1/3">
               <div className="bg-blue-500 text-white px-6 py-2 rounded shadow-lg font-mono w-full text-center">X₁ (Half A)</div>
               
               <div className="h-32 w-1 bg-blue-500/50 relative">
                 <div className="absolute top-0 w-3 h-3 -left-1 rounded-full bg-blue-400 animate-[ping_1.5s_infinite]"></div>
               </div>
               
               <div className="bg-blue-400 text-white px-6 py-2 rounded shadow-lg font-mono w-full text-center border border-blue-300">Y₁ = X₁</div>
               <p className="text-[10px] text-blue-200 mt-2 text-center">Passes through entirely untouched!</p>
            </div>

            {/* The Network Bridge */}
            <div className="absolute left-[35%] top-[25%] flex items-center">
               <div className="w-16 h-1 bg-blue-500/50"></div>
               <div className="bg-slate-800 text-white p-3 rounded-lg border border-slate-600 shadow-lg text-center text-xs">
                 Standard NN<br/><span className="text-[10px] text-gray-400">s(X₁), t(X₁)</span>
               </div>
               <div className="w-16 h-1 bg-rose-500/50 relative">
                 <div className="absolute right-0 -top-1 border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-rose-500"></div>
               </div>
            </div>

            {/* Right Side (Transform) */}
            <div className="flex flex-col items-center gap-4 w-1/3">
               <div className="bg-rose-500 text-white px-6 py-2 rounded shadow-lg font-mono w-full text-center">X₂ (Half B)</div>
               
               <div className="h-12 w-1 bg-rose-500/50"></div>
               
               <div className="bg-amber-400 text-slate-900 font-bold p-3 rounded-full border-2 border-amber-200 shadow-lg flex items-center justify-center">
                 <span className="text-xl leading-none px-1">Affine</span>
               </div>

               <div className="h-8 w-1 bg-rose-400/50 relative">
                  <ArrowDown size={16} className="absolute -left-1.5 bottom-0 text-rose-400"/>
               </div>
               
               <div className="bg-rose-400 text-white px-4 py-2 rounded shadow-lg font-mono w-full text-center text-[10px] border border-rose-300 flex flex-col">
                 <span className="font-bold text-xs mb-1">Y₂</span>
                 <span>X₂ ⊙ exp(s) + t</span>
               </div>
               <p className="text-[10px] text-rose-200 mt-2 text-center">Warped by the output of Half A's network.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
