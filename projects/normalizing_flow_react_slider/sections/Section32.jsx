import { ArrowRightLeft } from 'lucide-react';

export const meta = {
  title: "32. Vocabulary Shift: s & t vs μ & α",
  subtitle: "Are they the exact same thing? Yes!",
};

export default function Section32() {
  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-gray-700">
        They are the exact same concepts wearing a different trench coat! Different textbook authors just like to use different letters.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
          <h4 className="font-bold text-indigo-800 mb-2 border-b border-indigo-100 pb-2 w-full text-center">Translation (t) = Mean (μ)</h4>
          <div className="bg-indigo-50 w-full p-4 rounded-lg flex justify-center items-center gap-4 border border-indigo-200">
            <span className="text-2xl font-bold text-indigo-600">t</span>
            <ArrowRightLeft className="text-indigo-400"/>
            <span className="text-2xl font-bold text-indigo-600">μ</span>
          </div>
          <p className="text-xs text-gray-600 mt-3 text-center">It shifts the data left or right. It controls the center of the distribution.</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
          <h4 className="font-bold text-teal-800 mb-2 border-b border-teal-100 pb-2 w-full text-center">Scale (s) = Log-Std (α)</h4>
          <div className="bg-teal-50 w-full p-4 rounded-lg flex justify-center items-center gap-4 border border-teal-200">
            <span className="text-2xl font-bold text-teal-600">s</span>
            <ArrowRightLeft className="text-teal-400"/>
            <span className="text-2xl font-bold text-teal-600">α</span>
          </div>
          <p className="text-xs text-gray-600 mt-3 text-center">It stretches or squishes the data. It controls the width of the distribution.</p>
        </div>
      </div>
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center shadow-sm mt-4">
        <span className="text-sm font-bold text-slate-700">The Affine Math Equation:</span>
        <div className="mt-2 text-lg font-mono text-slate-800">
          Y₂ = (X₂ ⊙ exp(<span className="text-teal-600">s</span>)) + <span className="text-indigo-600">t</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">It's just a Shift and a Scale, identical to the Gaussian formula we used earlier!</p>
      </div>
    </div>
  );
}
