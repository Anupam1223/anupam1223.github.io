import { ArrowRight, ArrowLeft } from 'lucide-react';

export const meta = {
  title: "17. The Two-Way Bridge (Summary)",
  subtitle: "How architectural choices dictate the + or - loss function.",
};

export default function Section17() {
  return (
    <div className="space-y-3 animate-fade-in">
      <p className="text-gray-700 text-sm">
        The neural network is a 1-to-1 bridge between the Data World (X) and the Latent Blueprint (Z). Training <em>always</em> requires pushing real data to Z to be scored. The <code>+</code> or <code>-</code> simply depends on how the engineers built the bridge!
      </p>
      <div className="grid grid-cols-1 gap-4 mt-2">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-teal-700 flex items-center gap-2"><ArrowRight size={18}/> Choice A: Native Forward is X → Z</span>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded font-bold">e.g., MAF, RealNVP, Glow</span>
          </div>
          <p className="text-[11px] text-gray-600 mb-3">The bridge's "easy lane" goes from X to Z. During training, PyTorch just drives forward happily.</p>
          <div className="flex items-center justify-between bg-teal-50 p-3 rounded-lg border border-teal-100 mb-3">
            <div className="text-center w-1/4"><span className="font-bold text-teal-800 text-xs block">Data (X)</span></div>
            <div className="flex-1 relative flex flex-col items-center">
              <span className="text-[9px] text-teal-600 uppercase font-bold tracking-widest mb-1">Native Math Direction</span>
              <div className="w-full flex items-center justify-center">
                <div className="h-1 w-full bg-teal-200 rounded"></div>
                <ArrowRight className="text-teal-500 -ml-2" size={16}/>
              </div>
              <span className="text-[10px] text-teal-700 font-bold mt-1 bg-white px-2 py-0.5 rounded shadow-sm relative -top-3 border border-teal-100">Driving Forward (Training)</span>
            </div>
            <div className="text-center w-1/4"><span className="font-bold text-teal-800 text-xs block">Blueprint (Z)</span></div>
          </div>
          <div className="text-center">
            <code className="bg-teal-100 text-teal-800 px-3 py-1.5 rounded text-xs font-bold border border-teal-200 shadow-inner">Loss = log p_z(z) <strong className="text-teal-600 text-sm mx-1">+</strong> log |det(J)|</code>
            <p className="text-[10px] text-teal-600 mt-2 font-medium">Driving natively forward? PyTorch just <strong className="uppercase">Adds</strong> the stretch!</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-rose-700 flex items-center gap-2"><ArrowLeft size={18}/> Choice B: Native Forward is Z → X</span>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded font-bold">e.g., Inverse Autoregressive Flow (IAF)</span>
          </div>
          <p className="text-[11px] text-gray-600 mb-3">The bridge's "easy lane" goes from Z to X for blazingly fast generation. To train, we force real data backward against traffic!</p>
          <div className="flex items-center justify-between bg-rose-50 p-3 rounded-lg border border-rose-100 mb-3">
            <div className="text-center w-1/4"><span className="font-bold text-rose-800 text-xs block">Data (X)</span></div>
            <div className="flex-1 relative flex flex-col items-center">
              <span className="text-[9px] text-rose-600 uppercase font-bold tracking-widest mb-1">Native Math Direction</span>
              <div className="w-full flex items-center justify-center">
                <ArrowLeft className="text-rose-500 -mr-2 z-10" size={16}/>
                <div className="h-1 w-full bg-rose-200 rounded"></div>
              </div>
              <span className="text-[10px] text-rose-700 font-bold mt-1 bg-white px-2 py-0.5 rounded shadow-sm relative -top-3 border border-rose-100">Driving in Reverse (Training)</span>
            </div>
            <div className="text-center w-1/4"><span className="font-bold text-rose-800 text-xs block">Blueprint (Z)</span></div>
          </div>
          <div className="text-center">
            <code className="bg-rose-100 text-rose-800 px-3 py-1.5 rounded text-xs font-bold border border-rose-200 shadow-inner">Loss = log p_z(z) <strong className="text-rose-600 text-sm mx-1">-</strong> log |det(J)|</code>
            <p className="text-[10px] text-rose-600 mt-2 font-medium">Driving backward against the native math? <strong className="uppercase">Subtract</strong> to flip it!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
