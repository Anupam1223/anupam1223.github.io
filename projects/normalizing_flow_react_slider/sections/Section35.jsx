import { ArrowDown } from 'lucide-react';

export const meta = {
  title: "35. The Magic 'Cancel Out' Trick",
  subtitle: "How terrifying matrix math simplifies into simple addition.",
};

export default function Section35() {
  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-gray-700">
         The formula for the Volume Penalty requires us to calculate the <strong>Log-Determinant</strong>. Let's see what happens to exp(s)...
      </p>

      <div className="bg-slate-900 p-8 rounded-xl text-white shadow-xl mt-4 flex flex-col items-center justify-center border border-slate-700">
         
         <div className="bg-slate-800 px-6 py-3 rounded-lg border border-slate-600 shadow-sm flex items-center gap-3 text-lg font-mono text-slate-300">
            Volume Penalty = <span className="text-rose-400 font-bold">log</span> ( |<span className="text-white">det(J)</span>| )
         </div>

         <ArrowDown size={24} className="text-slate-600 my-4" />

         <div className="bg-slate-800 px-6 py-3 rounded-lg border border-slate-600 shadow-sm flex items-center gap-3 text-lg font-mono text-slate-300">
            Volume Penalty = <span className="text-rose-400 font-bold">log</span> ( <span className="text-teal-400 font-bold">exp(s)</span> )
         </div>

         <ArrowDown size={24} className="text-slate-600 my-4" />

         <div className="relative inline-block my-2">
            <span className="text-5xl font-black text-rose-500 opacity-50 relative inline-block">
               log( exp(
               <div className="absolute top-1/2 left-[-10%] w-[120%] h-1.5 bg-red-500 -rotate-12 z-10 shadow-lg"></div>
            </span>
            <span className="text-6xl font-black text-teal-400 mx-2 animate-pulse drop-shadow-[0_0_15px_rgba(45,212,191,0.6)]">s</span>
            <span className="text-5xl font-black text-rose-500 opacity-50 relative inline-block">
               ) )
               <div className="absolute top-1/2 left-[-10%] w-[120%] h-1.5 bg-red-500 -rotate-12 z-10 shadow-lg"></div>
            </span>
         </div>
         
         <p className="text-amber-400 font-bold text-sm mt-4 uppercase tracking-widest">Mathematical Opposites Cancel Out!</p>

         <div className="mt-8 bg-teal-900/40 border border-teal-500/50 px-8 py-4 rounded-xl text-center shadow-lg">
            <span className="block text-2xl font-bold text-teal-400 font-mono">Volume Penalty = s</span>
            <p className="text-xs text-teal-100 mt-2 opacity-80">The massive Jacobian matrix calculation literally simplifies down to just taking the <strong>s</strong> numbers from the Neural Network and adding them up!</p>
         </div>
      </div>
    </div>
  );
}
