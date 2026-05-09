import { CheckCircle2 } from 'lucide-react';

export const meta = {
  title: "31. The Grand Unification",
  subtitle: "Do we use Log-Likelihood and Backprop? Yes!",
};

export default function Section31() {
  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-gray-700">
        You have connected the dots perfectly! You just realized the greatest secret of Normalizing Flows: no matter how crazy the names get (MADE, MAF, IAF, RealNVP, Glow), <strong>the underlying engine is exactly the same</strong>.
      </p>
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl mt-4">
        <h4 className="text-white font-bold mb-4 flex items-center gap-2"><CheckCircle2 className="text-green-400"/> 1. The Training Loop is Identical</h4>
        <p className="text-sm text-slate-300 mb-4">
          The data flows through all the Coupling Layers, doing the splits and math, until it pops out at the very end as <code className="bg-slate-800 text-indigo-400 px-1 rounded">Z_final</code>. We call the exact same "Inspector":
        </p>
        <div className="bg-slate-800 p-4 rounded-lg text-center border border-slate-600 mb-4">
          <code className="text-rose-400 font-bold text-lg">Loss = -1 * (Blueprint Score + Volume Penalty)</code>
        </div>
        <p className="text-sm text-slate-300">
          We call <code className="bg-slate-800 px-1 rounded text-teal-400">loss.backward()</code>, and the error flows backward through the entire model, updating the weights inside <em>every single neural network</em> in those coupling layers simultaneously.
        </p>
      </div>
    </div>
  );
}
