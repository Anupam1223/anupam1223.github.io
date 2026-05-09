import { ArrowRight, ArrowLeft, Cpu } from 'lucide-react';
import { generateGaussianPath, generateComplexPath } from './helpers';

export const meta = {
  title: "5. The Blueprint vs. The Builder",
  subtitle: "Did the network design the Bell Curve?",
};

export default function Section05({ flowDirection, setFlowDirection }) {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        You might wonder: Do we use the neural network to <em>decide</em> what the Latent Space (Z) should look like?
        <strong> No! The shape of the Latent Space is a "blueprint" chosen entirely out of nowhere.</strong>
      </p>
      <p className="text-gray-700">
        We explicitly choose a perfect bell curve to be our target blueprint <em>before the AI even looks at the data</em>. We pick it because computers already know the exact mathematical rules for picking random numbers from a bell curve.
      </p>
      <p className="text-gray-700">
        The Neural Network doesn't <em>invent</em> the Latent Space. The network is the <strong>builder (or bridge)</strong> whose only job is to squish the messy data until it fits that pre-chosen blueprint.
      </p>
      <div className="bg-white p-5 rounded-xl border border-gray-200 mt-4 shadow-sm">
        <div className="flex justify-center gap-2 mb-8 bg-gray-100 p-1 rounded-lg w-fit mx-auto">
          <button
            onClick={() => setFlowDirection('training')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${flowDirection === 'training' ? 'bg-white shadow text-rose-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            1. Training Phase (X → Z)
          </button>
          <button
            onClick={() => setFlowDirection('generating')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${flowDirection === 'generating' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            2. Generating Phase (Z → X)
          </button>
        </div>
        <div className="flex items-center justify-between gap-2 px-4">
          <div className={`flex flex-col items-center transition-opacity ${flowDirection === 'generating' ? 'opacity-50' : 'opacity-100'}`}>
            <span className="text-xs font-bold text-rose-600 mb-2">Real Data (X)</span>
            <svg viewBox="0 0 100 50" className="w-24 border-b-2 border-rose-200 pb-1">
              <path d={generateComplexPath(100, 50)} fill="#fecdd3" stroke="#e11d48" strokeWidth="2" />
            </svg>
            <span className="text-[10px] text-gray-500 mt-2 max-w-[80px] text-center">Messy, complex dataset</span>
          </div>
          <div className="flex flex-col items-center relative flex-1">
            <div className={`w-full flex items-center justify-center transition-all duration-500 absolute top-[-15px] ${flowDirection === 'training' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-20px]'}`}>
              <div className="h-1 w-full bg-gradient-to-r from-rose-400 to-indigo-400 rounded-full relative overflow-hidden">
                <div className="absolute top-0 bottom-0 w-4 bg-white/60 shadow-[0_0_8px_white] animate-[moveRight_1.5s_linear_infinite]" />
              </div>
              <ArrowRight className="text-indigo-500 -ml-2" size={16} />
            </div>
            <div className={`w-full flex items-center justify-center transition-all duration-500 absolute top-[-15px] ${flowDirection === 'generating' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[20px]'}`}>
              <ArrowLeft className="text-rose-500 -mr-2 z-10" size={16} />
              <div className="h-1 w-full bg-gradient-to-l from-indigo-400 to-rose-400 rounded-full relative overflow-hidden">
                <div className="absolute top-0 bottom-0 w-4 bg-white/60 shadow-[0_0_8px_white] animate-[moveLeft_1.5s_linear_infinite]" />
              </div>
            </div>
            <div className="bg-slate-800 text-white p-3 rounded-lg shadow-lg flex flex-col items-center relative z-10 mt-4 border-2 border-slate-700">
              <Cpu size={24} className="mb-1 text-teal-400" />
              <span className="text-xs font-bold text-center">Neural Network<br/>(The Flow)</span>
            </div>
          </div>
          <div className={`flex flex-col items-center transition-opacity ${flowDirection === 'training' ? 'opacity-50' : 'opacity-100'}`}>
            <span className="text-xs font-bold text-indigo-600 mb-2">Latent Space (Z)</span>
            <svg viewBox="0 0 100 50" className="w-24 border-b-2 border-indigo-200 pb-1">
              <path d={generateGaussianPath(0, 1, 40, 100, 50)} fill="#c7d2fe" stroke="#4f46e5" strokeWidth="2" />
            </svg>
            <span className="text-[10px] text-gray-500 mt-2 max-w-[80px] text-center">Pre-chosen perfect bell curve blueprint</span>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes moveRight { from { left: -20%; } to { left: 120%; } }
          @keyframes moveLeft { from { right: -20%; } to { right: 120%; } }
        `}} />
        <div className="mt-6 bg-blue-50 text-blue-900 text-sm p-4 rounded-lg border border-blue-100">
          {flowDirection === 'training' ? (
            <p><strong>Training:</strong> The Neural Network takes real data (X) and tries to warp it. We tweak the network until the output perfectly matches our pre-chosen bell curve blueprint (Z).</p>
          ) : (
            <p><strong>Generating:</strong> Since we know the math of a bell curve, we easily pick a random point in Z. We run the Neural Network <em>in reverse</em> to warp that point into a brand new piece of complex data (X)!</p>
          )}
        </div>
      </div>
    </div>
  );
}
