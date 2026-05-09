import { ArrowLeft, AlertCircle, RotateCcw, CheckCircle2 } from 'lucide-react';
import { generateBlendedPath } from './helpers';

export const meta = {
  title: "7. Enforcing the Blueprint",
  subtitle: "How do we force the builder to follow the rules?",
};

export default function Section07({ trainingEpoch, runTrainingEpoch }) {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        If the network is doing the building, how does it know it's supposed to make a bell curve?
      </p>
      <p className="text-gray-700">
        We use our blueprint as a <strong>Scoring Formula</strong> (this is mathematically called the <em>Loss Function</em>). We know the exact math equation for a perfect bell curve. When the neural network spits out a shape, we plug that shape into our equation. The equation acts as a strict Inspector, grading the network's work!
      </p>
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-4 relative overflow-hidden">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex flex-col items-center w-1/3">
            <span className="text-xs font-bold text-gray-600 mb-2">Network's Current Output</span>
            <svg viewBox="0 0 120 60" className="w-full bg-white rounded-lg border border-gray-200 p-2">
              <path d={generateBlendedPath(trainingEpoch / 100)} fill="#e2e8f0" stroke="#64748b" strokeWidth="2" style={{ transition: 'd 0.5s ease-in-out' }} />
            </svg>
          </div>
          <div className="flex flex-col items-center w-1/3 z-10">
            <div className="bg-indigo-600 text-white rounded-lg p-3 flex flex-col items-center shadow-lg relative">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-1 bg-indigo-600"></div>
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-1 bg-indigo-600"></div>
              <span className="text-[10px] uppercase tracking-wider mb-1 font-semibold opacity-80">The Inspector</span>
              <span className="text-sm font-bold text-center">Blueprint Formula<br/>(Loss Function)</span>
            </div>
          </div>
          <div className="flex flex-col items-center w-1/3">
            <span className="text-xs font-bold text-gray-600 mb-2">Score (Likelihood)</span>
            <div className={`w-full p-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-colors duration-500 ${
              trainingEpoch < 50 ? 'bg-red-50 border-red-200 text-red-600' :
              trainingEpoch < 99 ? 'bg-yellow-50 border-yellow-200 text-yellow-600' :
              'bg-green-50 border-green-200 text-green-600'
            }`}>
              {trainingEpoch < 50 ? <AlertCircle size={20}/> :
               trainingEpoch < 99 ? <RotateCcw size={20}/> :
               <CheckCircle2 size={20}/>}
              <span className="font-bold text-lg">{Math.round(trainingEpoch)}% Match</span>
            </div>
          </div>
        </div>
        <div className="relative h-8 w-full">
          <div className="absolute bottom-0 right-[16%] w-[68%] h-full border-b-2 border-l-2 border-r-2 border-dashed border-gray-400 rounded-b-xl"></div>
          <div className="absolute -bottom-2 left-[15%] text-gray-500 bg-slate-50 px-2 text-xs font-bold flex items-center">
            <ArrowLeft size={14} className="mr-1"/> "Adjust your layers!" (Backpropagation)
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={runTrainingEpoch}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full shadow transition-transform active:scale-95 flex items-center gap-2"
          >
            {trainingEpoch >= 100 ? "Reset Training" : "Run Training Loop"}
          </button>
        </div>
      </div>
    </div>
  );
}
