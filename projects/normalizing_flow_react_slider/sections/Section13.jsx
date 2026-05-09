import { ArrowRightLeft, ArrowRight, Box, XCircle } from 'lucide-react';

export const meta = {
  title: "13. The Strict Rule of Bijection",
  subtitle: "No folding, no tearing, no losing data.",
};

export default function Section13() {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        For this math to work, the text says the Neural Network must be a <strong>Bijection</strong>. This means the network must follow two strict rules:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
          <span className="font-bold text-indigo-700 mb-2 flex items-center gap-2"><ArrowRightLeft size={18}/> 1. One-to-One</span>
          <p className="text-xs text-gray-600 text-center mb-4">Every point in Z maps to exactly one point in X. You cannot fold the rubber sheet over itself!</p>
          <div className="flex gap-4 items-center">
            <div className="flex flex-col gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
              <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
            </div>
            <div className="flex flex-col gap-2">
              <ArrowRight size={14} className="text-gray-400"/>
              <ArrowRight size={14} className="text-gray-400"/>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400"></div>
              <div className="w-3 h-3 rounded-full bg-rose-400"></div>
            </div>
          </div>
          <div className="mt-3 text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100 flex items-center gap-1">
            <XCircle size={12}/> If 2 points mapped to 1, probability is lost!
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
          <span className="font-bold text-teal-700 mb-2 flex items-center gap-2"><Box size={18}/> 2. Identical Dimensions</span>
          <p className="text-xs text-gray-600 text-center mb-4">You cannot turn a 3D object into a 2D shadow. Inputs and Outputs must match perfectly.</p>
          <div className="flex items-center gap-2 font-mono text-sm font-bold text-gray-500">
            <div className="bg-teal-50 text-teal-700 p-2 rounded">3D (Z)</div>
            <ArrowRight size={16}/>
            <div className="bg-teal-50 text-teal-700 p-2 rounded">3D (X)</div>
          </div>
          <div className="mt-3 text-[10px] bg-teal-50 text-teal-800 px-2 py-1 rounded border border-teal-100 text-center">
            Mathematically required so the Jacobian is a <strong>Square Matrix</strong>. You can only calculate Determinants for squares!
          </div>
        </div>
      </div>
    </div>
  );
}
