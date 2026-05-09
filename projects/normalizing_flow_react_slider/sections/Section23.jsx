import { CheckCircle2 } from 'lucide-react';

export const meta = {
  title: "23. Anatomy of a Flow Layer",
  subtitle: "How the Brain and the Muscle work together.",
};

export default function Section23() {
  return (
    <div className="space-y-4">
      <p className="text-gray-700 text-sm">
        Let's tear apart the giant "Flow Layer" wrapper. Because it literally contains an entire MADE neural network inside it, we call it "Smarter" than an old Planar flow.
      </p>
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl relative overflow-hidden">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes move-x { 0% { left: 0%; } 100% { left: 100%; } }
        `}} />
        <h4 className="text-white font-bold mb-4 text-center">The Flow Layer Wrapper</h4>
        <div className="flex items-center justify-between gap-2 relative">
          <div className="flex flex-col items-center w-1/5 z-10">
            <div className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded mb-1 shadow-[0_0_10px_rgba(59,130,246,0.5)]">Data (X)</div>
            <span className="text-gray-400 text-[9px]">Step A: Enters</span>
          </div>
          <div className="flex flex-col items-center w-2/5 z-10">
            <div className="bg-rose-500 text-white text-xs font-bold px-4 py-3 rounded-lg border-2 border-rose-300 shadow-[0_0_15px_rgba(225,29,72,0.6)] w-full text-center relative overflow-hidden">
              <span className="relative z-10">MADE Network</span>
              <div className="absolute top-0 bottom-0 left-0 w-4 bg-white/30 skew-x-12 animate-[move-x_2s_linear_infinite]" />
            </div>
            <span className="text-rose-200 text-[9px] mt-1 text-center">Step B: Dumb neurons do ((W⊙M)*X)+b</span>
            <div className="flex gap-4 mt-2">
              <div className="bg-rose-900/50 text-rose-200 px-2 py-1 rounded text-[10px] border border-rose-500/50">μ (Shift)</div>
              <div className="bg-rose-900/50 text-rose-200 px-2 py-1 rounded text-[10px] border border-rose-500/50">α (Scale)</div>
            </div>
            <span className="text-gray-400 text-[9px] mt-1">Step C: Output Vectors</span>
          </div>
          <div className="flex flex-col items-center w-2/5 z-10">
            <div className="bg-teal-500 text-white text-[11px] font-mono font-bold px-3 py-3 rounded-lg border-2 border-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.6)] w-full text-center">
              Z = (X - μ) * exp(-α)
            </div>
            <span className="text-teal-200 text-[9px] mt-1 text-center">Step D: The Final Math</span>
          </div>
          <div className="flex flex-col items-center w-1/5 z-10">
            <div className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded mt-1 shadow-[0_0_10px_rgba(99,102,241,0.5)]">Latent (Z)</div>
            <span className="text-gray-400 text-[9px]">Step E: Next Layer</span>
          </div>
          <div className="absolute top-6 left-[10%] w-[80%] h-0.5 bg-slate-600 z-0"></div>
          <div className="absolute top-6 left-[10%] w-[30%] h-0.5 bg-blue-400 z-0 shadow-[0_0_8px_#3b82f6]"></div>
        </div>
        <div className="mt-8 bg-slate-800 p-3 rounded border border-slate-600 text-xs text-slate-300 flex flex-col gap-1">
          <span className="text-white font-bold flex items-center gap-2"><CheckCircle2 size={14} className="text-green-400"/> Your Mental Model is Flawless</span>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li><strong>MADE</strong> is a neural network using standard backprop, gradients, and <code>wx+b</code> (just with masks).</li>
            <li><strong>MAF</strong> is the architecture made of multiple stacked Flow Layers.</li>
            <li>The Jacobian determinant only measures the final stretch in Step D.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
