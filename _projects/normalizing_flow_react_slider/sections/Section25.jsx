import { ArrowRight, ArrowLeft } from 'lucide-react';

export const meta = {
  title: "25. The End-to-End Relay Race (MAF)",
  subtitle: "How multiple Flow Layers train together without stopping.",
};

export default function Section25() {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        MAF = multiple Flow Layers stacked together. But we do <strong>not</strong> calculate loss or backpropagate after each layer. They act as a massive relay race!
      </p>
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl relative overflow-hidden text-white">
        <div className="flex flex-col gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/20 text-blue-400 p-3 rounded-lg border border-blue-500/50 w-1/4 text-center">
              <span className="block font-bold text-sm">1. Forward Pass</span>
              <span className="text-[10px]">Data flows through all layers</span>
            </div>
            <div className="flex-1 flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-slate-600">
              <div className="text-center"><span className="text-xs text-slate-400 block">Layer 1</span><span className="font-mono text-sm">Z₁</span></div>
              <ArrowRight size={14} className="text-slate-500"/>
              <div className="text-center"><span className="text-xs text-slate-400 block">Layer 2</span><span className="font-mono text-sm">Z₂</span></div>
              <ArrowRight size={14} className="text-slate-500"/>
              <div className="text-center"><span className="text-xs text-slate-400 block">Layer 10</span><span className="font-mono text-sm text-indigo-400 font-bold">Z_final</span></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-teal-500/20 text-teal-400 p-3 rounded-lg border border-teal-500/50 w-1/4 text-center">
              <span className="block font-bold text-sm">2. Global Loss</span>
              <span className="text-[10px]">Calculated exactly ONCE</span>
            </div>
            <div className="flex-1 flex items-center gap-4 bg-slate-800 p-3 rounded-lg border border-slate-600">
              <div className="flex-1 text-center text-xs">
                <span className="block text-slate-400">Blueprint Score</span>
                <span className="font-mono text-indigo-300">log p(Z_final)</span>
              </div>
              <div className="text-teal-500 font-bold">+</div>
              <div className="flex-1 text-center text-xs">
                <span className="block text-slate-400">Total Volume Penalty</span>
                <span className="font-mono text-teal-300">Σ log|det(J)|</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-rose-500/20 text-rose-400 p-3 rounded-lg border border-rose-500/50 w-1/4 text-center">
              <span className="block font-bold text-sm">3. Backpropagate</span>
              <span className="text-[10px]">The Domino Effect</span>
            </div>
            <div className="flex-1 flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-rose-900/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-l from-rose-500/10 to-transparent"></div>
              <div className="text-center z-10"><span className="text-xs text-rose-300 block">Update MADE 1</span></div>
              <ArrowLeft size={14} className="text-rose-500 z-10"/>
              <div className="text-center z-10"><span className="text-xs text-rose-300 block">Update MADE 2</span></div>
              <ArrowLeft size={14} className="text-rose-500 z-10"/>
              <div className="text-center z-10"><span className="text-xs text-rose-300 block">Update MADE 10</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-indigo-50 border border-indigo-200 rounded p-4 text-sm text-indigo-900">
        Every MADE network is just a small gear in a massive machine. The data flows completely through all the gears, we calculate <strong>one final score</strong> at the very end, and that single score ripples backward to tune every single gear at the same time!
      </div>
    </div>
  );
}
