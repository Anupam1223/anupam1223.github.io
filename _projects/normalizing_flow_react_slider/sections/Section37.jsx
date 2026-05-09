import { Network, CheckCircle2 } from 'lucide-react';

export const meta = {
  title: "37. Why Coupling is Easier to Code",
  subtitle: "Goodbye, complicated binary masks!",
};

export default function Section37() {
  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-gray-700">
        In MAF, you had to write a complicated "Binary Mask" to cut the wires inside the Neural Network so it wouldn't cheat. In Affine Coupling, <strong>you don't need a mask at all!</strong>
      </p>

      <div className="flex flex-col md:flex-row gap-6 mt-4">
        <div className="flex-1 bg-white p-5 rounded-xl border border-gray-200 shadow-sm opacity-60 grayscale">
          <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-3 text-center">MAF (The Hard Way)</h4>
          <div className="flex justify-center mb-3">
            <Network size={32} className="text-slate-400"/>
          </div>
          <p className="text-xs text-slate-600 text-center">Requires calculating exact "degrees" for every hidden neuron and multiplying weight matrices by 0 to prevent looking into the future.</p>
        </div>

        <div className="flex-1 bg-white p-5 rounded-xl border border-emerald-300 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">THE EASY WAY</div>
          <h4 className="font-bold text-emerald-800 border-b border-emerald-100 pb-2 mb-3 text-center">Coupling (Physical Split)</h4>
          <div className="flex justify-center gap-4 mb-3">
            <div className="bg-blue-100 border border-blue-300 px-3 py-1 rounded text-xs font-mono font-bold text-blue-800">x[:50]</div>
            <div className="bg-rose-100 border border-rose-300 px-3 py-1 rounded text-xs font-mono font-bold text-rose-800">x[50:]</div>
          </div>
          <p className="text-xs text-emerald-700 text-center leading-relaxed">
            Because you physically split the data array in half, and the Neural Network <em>only</em> takes Half A as input, it is physically impossible for the network to cheat and look at Half B.
          </p>
        </div>
      </div>

      <div className="mt-6 bg-slate-900 text-white p-4 rounded-xl text-center shadow-xl border border-slate-700">
        <span className="block text-lg font-bold mb-1 flex justify-center items-center gap-2"><CheckCircle2 className="text-green-400"/> You have fully mastered the architecture!</span>
        <span className="text-sm text-slate-300 leading-relaxed block mt-1">You can use literally any standard, off-the-shelf neural network (MLP, ResNet, etc.) as your "Brain" to calculate s and t. You are completely ready to write the code for this!</span>
      </div>
    </div>
  );
}
