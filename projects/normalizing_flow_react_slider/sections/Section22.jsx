import { ArrowRight } from 'lucide-react';

export const meta = {
  title: "22. The Terminology Trap: 'Layers'",
  subtitle: "Dumb Neurons vs. Big Wrappers.",
};

export default function Section22() {
  return (
    <div className="space-y-4">
      <p className="text-gray-700 text-sm">
        You are 100% correct! Neurons do not possess a brain; they just do <code>wx+b</code>. The confusion comes from AI researchers using the word <strong>"Layer"</strong> to mean two different things.
      </p>
      <div className="flex flex-col md:flex-row gap-4 items-stretch mt-4">
        <div className="flex-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-rose-800 mb-2 border-b border-rose-100 pb-1">1. "Neural Network Layer"</h4>
            <p className="text-[11px] text-gray-600 mb-3">Inside the MADE network, a layer is just a collection of dumb neurons. They multiply data by weights, add bias, apply ReLU, and output a vector <code>[h₁, h₂, ..., hₙ]</code>.</p>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-200 text-center font-mono text-xs">
            <div className="text-gray-500 mb-1">Standard: <span className="text-gray-800">y = (w * x) + b</span></div>
            <div className="text-rose-600 font-bold text-sm bg-rose-50 py-1 rounded">MADE: y = ((W ⊙ Mask) * X) + b</div>
          </div>
          <p className="text-[10px] text-gray-500 mt-2 text-center">It is just standard neural network math, but the Mask mathematically forces some weights to be 0 (blindfolding them).</p>
        </div>
        <div className="flex-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-indigo-800 mb-2 border-b border-indigo-100 pb-1">2. "Flow Layer" (The Wrapper)</h4>
            <p className="text-[11px] text-gray-600 mb-3">A Flow Layer is <strong>not</strong> a layer of neurons. It is a massive mathematical box (a module) that <em>contains</em> a MADE neural network inside it, plus the final algebra.</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-indigo-50 px-2 py-1 rounded text-[10px] text-indigo-800 font-bold border border-indigo-100 text-center">MADE Network (The Brain)</div>
            <div className="flex justify-center"><ArrowRight className="text-indigo-300 rotate-90" size={14}/></div>
            <div className="bg-teal-50 px-2 py-1 rounded text-[10px] text-teal-800 font-bold border border-teal-100 text-center">Math Equation (The Muscle)</div>
          </div>
          <p className="text-[10px] text-gray-500 mt-2 text-center">When we say MAF "stacks multiple layers", it stacks multiple of these giant Flow Wrapper boxes!</p>
        </div>
      </div>
    </div>
  );
}
