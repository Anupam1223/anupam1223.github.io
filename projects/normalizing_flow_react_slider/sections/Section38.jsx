import React from 'react';
import { ArrowDown, ArrowRightLeft, Cpu, Zap, Waves, Network, Database, Lock } from 'lucide-react';

export const meta = {
  title: "38. Phase II to Phase III Architecture",
  subtitle: "Mapping the exact data flow for the Genesis Mission.",
};

export default function ArchitectureSection() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-extrabold text-indigo-900 mb-2">Phase II to Phase III Architecture</h3>
        <p className="text-sm text-indigo-800 leading-relaxed">
           This diagram maps the exact data flow required by the DOE Genesis Mission. Notice two major changes: 
           <strong> 1) The Causal Fix:</strong> Controls (u) no longer go into the Normalizing Flow. The flow ONLY learns the natural weather/demand probabilities given current conditions.
           <strong> 2) The Spline Upgrade:</strong> We replaced rigid Affine math with highly flexible Rational Quadratic Splines to handle industrial SCADA tails.
        </p>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl overflow-y-auto h-[600px] relative font-mono custom-scrollbar">
         <style dangerouslySetInnerHTML={{__html: `
          .custom-scrollbar::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: #0f172a; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        `}} />

         {/* STEP 1: CAUSAL PARTITION */}
         <div className="flex flex-col items-center w-full mb-16">
            <span className="bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-slate-600 mb-6 shadow-md">1. The Causal Partition</span>
            
            <div className="flex justify-center gap-8 w-full text-center relative">
               
               {/* Controls Bypassing the Flow */}
               <div className="absolute left-4 top-0 bottom-0 w-1/4 flex flex-col items-center z-0 opacity-50">
                  <div className="h-full border-l-2 border-dashed border-amber-500/50 absolute left-1/2"></div>
                  <div className="bg-slate-900 text-amber-500/80 text-[10px] uppercase font-bold py-1 px-2 mt-32 rotate-[-90deg] whitespace-nowrap border border-amber-500/30 rounded">Bypasses Phase II</div>
               </div>

               <div className="flex flex-col gap-4 w-1/4 z-10">
                  <div className="bg-amber-900/80 border border-amber-500 p-4 rounded-xl text-amber-200 shadow-lg relative">
                     <Lock size={14} className="absolute top-2 right-2 text-amber-500"/>
                     <span className="font-bold text-sm block mb-1">u (Controls)</span>
                     <span className="text-[10px] opacity-80">Shaft Speed / Setpoints</span>
                  </div>
               </div>

               <div className="flex flex-col gap-4 w-1/4 z-10">
                  <div className="bg-blue-900/80 border border-blue-500 p-4 rounded-xl text-blue-200 shadow-lg">
                     <span className="font-bold text-sm block mb-1">x (Measured)</span>
                     <span className="text-[10px] opacity-80">Current SCADA State</span>
                  </div>
               </div>

               <div className="flex flex-col items-center w-1/3 z-10">
                  <div className="bg-rose-600 text-white p-4 rounded-xl text-sm font-bold w-full shadow-[0_0_15px_rgba(225,29,72,0.4)] border border-rose-400">
                     θ (Uncertain Future)
                  </div>
                  <ArrowDown size={24} className="text-rose-500 mb-4 mt-2"/>
                  <div className="flex gap-4 w-full">
                     <div className="bg-rose-400/20 text-rose-300 py-3 rounded-lg text-sm font-bold flex-1 border border-rose-400/50 shadow-inner">θ₁ (Half A)</div>
                     <div className="bg-rose-400/20 text-rose-300 py-3 rounded-lg text-sm font-bold flex-1 border border-rose-400/50 shadow-inner">θ₂ (Half B)</div>
                  </div>
               </div>
            </div>
         </div>

         {/* STEP 2: NEURAL SPLINE COUPLING LAYER 1 */}
         <div className="flex flex-col items-center w-full mb-12 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 shadow-lg">
            <span className="bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-slate-600 mb-6">2. Neural Spline Coupling Layer 1</span>
            
            <div className="flex justify-center gap-10 w-full">
               <div className="w-1/2 flex flex-col items-center relative">
                  <div className="text-xs font-bold text-slate-300 mb-4 flex items-center gap-3">
                    <span className="bg-rose-500/20 border border-rose-500/50 text-rose-300 px-3 py-1.5 rounded-lg shadow-sm">θ₁</span> 
                    <span className="text-slate-500">+</span> 
                    <span className="bg-blue-500/20 border border-blue-500/50 text-blue-300 px-3 py-1.5 rounded-lg shadow-sm">x</span>
                    {/* Notice u is gone! */}
                  </div>
                  <ArrowDown size={20} className="text-slate-500 mb-3"/>
                  <div className="bg-slate-700 border-2 border-indigo-500 p-5 rounded-xl flex flex-col items-center shadow-[0_0_20px_rgba(99,102,241,0.2)] w-full">
                     <Cpu size={24} className="text-indigo-400 mb-2"/>
                     <span className="text-sm text-white font-bold tracking-wide">Residual MLP 1</span>
                  </div>
                  <ArrowDown size={20} className="text-slate-500 mt-3 mb-3"/>
                  
                  {/* Spline Parameters Output */}
                  <div className="flex gap-2 w-full justify-center">
                     <span className="bg-purple-600/80 border border-purple-400 text-white font-bold px-3 py-1.5 rounded text-[10px] shadow-md flex flex-col items-center"><span className="text-[8px] opacity-70">Widths</span>W₁</span>
                     <span className="bg-fuchsia-600/80 border border-fuchsia-400 text-white font-bold px-3 py-1.5 rounded text-[10px] shadow-md flex flex-col items-center"><span className="text-[8px] opacity-70">Heights</span>H₁</span>
                     <span className="bg-teal-600/80 border border-teal-400 text-white font-bold px-3 py-1.5 rounded text-[10px] shadow-md flex flex-col items-center"><span className="text-[8px] opacity-70">Derivs</span>D₁</span>
                  </div>
               </div>

               <div className="w-1/3 flex flex-col items-center">
                  <div className="text-sm font-bold text-rose-300 mb-4 bg-rose-500/20 border border-rose-500/50 px-6 py-1.5 rounded-lg shadow-sm">θ₂</div>
                  <ArrowDown size={20} className="text-rose-500 mb-3"/>
                  <div className="bg-slate-700 border-2 border-rose-500 p-5 rounded-xl flex flex-col items-center shadow-[0_0_20px_rgba(225,29,72,0.2)] w-full">
                     <Waves size={24} className="text-rose-400 mb-2"/>
                     <span className="text-[11px] text-white font-bold mb-2 text-center leading-tight">Rational Quadratic<br/>Spline Binning</span>
                     <code className="text-[9px] text-rose-200 bg-slate-900 px-2 py-1 rounded border border-slate-600">Spline(θ₂ | W₁, H₁, D₁)</code>
                  </div>
                  <ArrowDown size={20} className="text-rose-500 mt-3 mb-3"/>
                  <span className="bg-rose-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md">Y₂</span>
               </div>
            </div>
         </div>

         {/* STEP 3: THE SWAP */}
         <div className="flex flex-col items-center w-full mb-12">
            <div className="flex items-center gap-6 bg-indigo-900/20 px-8 py-5 rounded-2xl border border-indigo-500/30 shadow-lg">
               <span className="bg-rose-500 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md">Y₂</span>
               <div className="flex flex-col items-center px-4">
                  <span className="text-[10px] text-indigo-300 font-bold mb-2 tracking-wider bg-indigo-950 px-2 py-1 rounded border border-indigo-500/50">torch.flip()</span>
                  <ArrowRightLeft size={28} className="text-indigo-400"/>
               </div>
               <span className="bg-rose-400/20 border border-rose-500/50 text-rose-300 px-5 py-2 rounded-lg text-sm font-bold shadow-md">θ₁</span>
            </div>
         </div>

         {/* STEP 4: LAYER 2 */}
         <div className="flex flex-col items-center w-full mb-16 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 shadow-lg">
            <span className="bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-slate-600 mb-6">3. Neural Spline Coupling Layer 2</span>
            
            <div className="flex justify-center gap-10 w-full">
               <div className="w-1/2 flex flex-col items-center relative">
                  <div className="text-xs font-bold text-slate-300 mb-4 flex items-center gap-3">
                    <span className="bg-rose-500 border border-rose-600 text-white px-3 py-1.5 rounded-lg shadow-sm">Y₂</span> 
                    <span className="text-slate-500">+</span> 
                    <span className="bg-blue-500/20 border border-blue-500/50 text-blue-300 px-3 py-1.5 rounded-lg shadow-sm">x</span> 
                  </div>
                  <ArrowDown size={20} className="text-slate-500 mb-3"/>
                  <div className="bg-slate-700 border-2 border-indigo-500 p-5 rounded-xl flex flex-col items-center shadow-[0_0_20px_rgba(99,102,241,0.2)] w-full">
                     <Cpu size={24} className="text-indigo-400 mb-2"/>
                     <span className="text-sm text-white font-bold tracking-wide">Residual MLP 2</span>
                  </div>
                  <ArrowDown size={20} className="text-slate-500 mt-3 mb-3"/>
                  <div className="flex gap-2 w-full justify-center">
                     <span className="bg-purple-600/80 border border-purple-400 text-white font-bold px-3 py-1.5 rounded text-[10px] shadow-md flex flex-col items-center"><span className="text-[8px] opacity-70">Widths</span>W₂</span>
                     <span className="bg-fuchsia-600/80 border border-fuchsia-400 text-white font-bold px-3 py-1.5 rounded text-[10px] shadow-md flex flex-col items-center"><span className="text-[8px] opacity-70">Heights</span>H₂</span>
                     <span className="bg-teal-600/80 border border-teal-400 text-white font-bold px-3 py-1.5 rounded text-[10px] shadow-md flex flex-col items-center"><span className="text-[8px] opacity-70">Derivs</span>D₂</span>
                  </div>
               </div>

               <div className="w-1/3 flex flex-col items-center">
                  <div className="text-sm font-bold text-rose-300 mb-4 bg-rose-400/20 border border-rose-500/50 px-6 py-1.5 rounded-lg shadow-sm">θ₁</div>
                  <ArrowDown size={20} className="text-rose-500 mb-3"/>
                  <div className="bg-slate-700 border-2 border-rose-500 p-5 rounded-xl flex flex-col items-center shadow-[0_0_20px_rgba(225,29,72,0.2)] w-full">
                     <Waves size={24} className="text-rose-400 mb-2"/>
                     <span className="text-[11px] text-white font-bold mb-2 text-center leading-tight">Rational Quadratic<br/>Spline Binning</span>
                     <code className="text-[9px] text-rose-200 bg-slate-900 px-2 py-1 rounded border border-slate-600">Spline(θ₁ | W₂, H₂, D₂)</code>
                  </div>
                  <ArrowDown size={20} className="text-rose-500 mt-3 mb-3"/>
                  <span className="bg-indigo-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md">Z₂</span>
               </div>
            </div>
         </div>

         {/* STEP 5: LOSS (TRAINING ONLY) */}
         <div className="flex flex-col items-center w-full mb-16">
            <span className="bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-slate-600 mb-6 shadow-md">4. Flow Loss (Phase II Training)</span>
            
            <div className="flex items-center gap-4 mb-6">
               <span className="text-white text-sm font-bold">Z_final = </span>
               <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm flex gap-3 border-2 border-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.5)] font-bold">
                  <span>Y₂</span>
                  <span className="border-l-2 border-indigo-400 pl-3">Z₂</span>
               </div>
            </div>

            <div className="bg-slate-800/80 w-full p-6 rounded-2xl border border-slate-600 shadow-2xl max-w-xl">
               <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-400 font-sans font-medium">Blueprint Score:</span>
                     <code className="text-indigo-300 bg-indigo-950 px-3 py-1.5 rounded-lg border border-indigo-500/30">gaussian.log_prob(Z_final)</code>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-400 font-sans font-medium text-left">Spline Penalty:</span>
                     <code className="text-teal-300 bg-teal-950 px-3 py-1.5 rounded-lg border border-teal-500/30">sum(spline_log_det_1 + det_2)</code>
                  </div>
                  <div className="border-t border-slate-600 my-2"></div>
                  <div className="flex justify-between items-center text-base font-bold">
                     <span className="text-rose-400 font-sans">Final Phase II Loss:</span>
                     <code className="text-white bg-rose-900/60 border border-rose-500 px-3 py-1.5 rounded-lg shadow-inner">-1 * (Score + Penalty)</code>
                  </div>
               </div>
            </div>
         </div>

         {/* NEW STEP: PHASE III HANDOFF */}
         <div className="flex flex-col items-center w-full pb-8">
            <span className="bg-emerald-900/80 text-emerald-300 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-emerald-500 mb-6 shadow-[0_0_15px_rgba(16,185,129,0.2)]">5. Phase III Handoff (The Physics Predictor)</span>
            
            <div className="flex gap-4 items-center justify-center w-full mb-6">
               <div className="bg-blue-900 border border-blue-500 text-blue-200 px-4 py-2 rounded-lg text-xs font-bold shadow-md">x (Measured)</div>
               <div className="text-slate-500 font-bold">+</div>
               <div className="bg-rose-900 border border-rose-500 text-rose-200 px-4 py-2 rounded-lg text-xs font-bold shadow-md flex flex-col items-center">
                  <span>θ (Generated)</span>
                  <span className="text-[8px] font-normal opacity-80">Sampled from trained Flow</span>
               </div>
               <div className="text-slate-500 font-bold">+</div>
               <div className="bg-amber-900 border border-amber-500 text-amber-200 px-4 py-2 rounded-lg text-xs font-bold shadow-md flex flex-col items-center">
                  <span>u (Controls)</span>
                  <span className="text-[8px] font-normal opacity-80">Re-enters the pipeline here</span>
               </div>
            </div>

            <ArrowDown size={24} className="text-emerald-500 mb-4 animate-bounce"/>

            <div className="bg-[#0f172a] border border-emerald-500/50 p-6 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col items-center max-w-lg text-center">
               <Network size={32} className="text-emerald-400 mb-3"/>
               <h4 className="text-white font-bold text-lg mb-2">Phase III: Tensor Network Surrogate</h4>
               <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  The generated future scenario (θ), current measurements (x), and proposed controls (u) are fed into a <strong>Matrix Product State (Tensor Train)</strong> compressed via TT-Cross. This Tensor Network outputs the final Energy Fuel consumption and Surge Probabilities.
               </p>
               <div className="mt-4 bg-emerald-950 border border-emerald-800 text-emerald-400 px-4 py-2 rounded text-xs font-mono font-bold w-full text-center">
                  (x, θ, u) → Tensor_Surrogate → Energy Output
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}