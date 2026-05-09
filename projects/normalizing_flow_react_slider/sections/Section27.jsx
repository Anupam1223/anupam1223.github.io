import { ArrowDown, RotateCcw } from 'lucide-react';

export const meta = {
  title: "27. The Autoregressive Bottleneck",
  subtitle: "Why MAF struggles with real-time Control and Simulation.",
};

export default function Section27() {
  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-gray-700">
        For problems like Model Predictive Control (MPC) of energy pipelines, we must simulate <em>thousands</em> of future states in milliseconds. Autoregressive flows (like MAF) fail here because of the <strong>Sampling Bottleneck</strong>.
      </p>

      <div className="flex flex-col md:flex-row gap-6 mt-4">
         {/* Fast Forward (Training) */}
         <div className="flex-1 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
            <h4 className="font-bold text-teal-700 mb-3 border-b border-teal-100 pb-2 w-full text-center">Forward Pass (Training)</h4>
            <div className="bg-teal-50 w-full rounded-lg p-4 flex flex-col gap-2 items-center border border-teal-200">
               <div className="flex gap-1 w-full justify-center">
                 {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-6 h-6 bg-teal-400 rounded-sm"></div>
                 ))}
               </div>
               <ArrowDown size={16} className="text-teal-400" />
               <div className="w-full bg-slate-800 text-white text-xs text-center py-2 rounded shadow-inner">Masked Neural Network</div>
               <ArrowDown size={16} className="text-teal-400" />
               <div className="flex gap-1 w-full justify-center">
                 {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-6 h-6 bg-indigo-400 rounded-full"></div>
                 ))}
               </div>
            </div>
            <div className="mt-4 text-center">
               <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-bold">Fast & Parallel</span>
               <p className="text-[11px] text-gray-500 mt-2">All data points process simultaneously in one GPU operation.</p>
            </div>
         </div>

         {/* Slow Inverse (Sampling) */}
         <div className="flex-1 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
            <h4 className="font-bold text-rose-700 mb-3 border-b border-rose-100 pb-2 w-full text-center">Inverse Pass (Sampling)</h4>
            
            <div className="bg-rose-50 w-full rounded-lg p-4 flex flex-col gap-2 items-center border border-rose-200">
               <div className="flex gap-1 w-full justify-center">
                 <div className="w-6 h-6 bg-indigo-400 rounded-full"></div>
                 <div className="w-6 h-6 bg-gray-300 rounded-full opacity-30"></div>
                 <div className="w-6 h-6 bg-gray-300 rounded-full opacity-30"></div>
                 <div className="w-6 h-6 bg-gray-300 rounded-full opacity-30"></div>
                 <div className="w-6 h-6 bg-gray-300 rounded-full opacity-30"></div>
               </div>
               <div className="flex justify-center w-full relative">
                  <ArrowDown size={16} className="text-rose-400" />
                  <RotateCcw size={14} className="absolute right-[30%] text-rose-500 animate-[spin_2s_linear_infinite]" />
               </div>
               <div className="w-full bg-slate-800 text-white text-xs text-center py-2 rounded shadow-inner">MADE Network</div>
               <ArrowDown size={16} className="text-rose-400" />
               <div className="flex gap-1 w-full justify-center">
                 <div className="w-6 h-6 bg-teal-400 rounded-sm"></div>
                 <div className="w-6 h-6 bg-teal-400 rounded-sm"></div>
                 <div className="w-6 h-6 border-2 border-dashed border-rose-300 rounded-sm"></div>
                 <div className="w-6 h-6 border-2 border-dashed border-rose-300 rounded-sm"></div>
                 <div className="w-6 h-6 border-2 border-dashed border-rose-300 rounded-sm"></div>
               </div>
            </div>

            <div className="mt-4 text-center">
               <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-bold">Slow Sequential Loop</span>
               <p className="text-[11px] text-gray-500 mt-2">Generating D variables requires D separate passes through the network.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
