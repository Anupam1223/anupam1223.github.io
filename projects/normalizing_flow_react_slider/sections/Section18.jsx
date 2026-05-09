import { ArrowRight } from 'lucide-react';

export const meta = {
  title: "18. The Triangular Cheat Code",
  subtitle: "How computers calculate Jacobians without exploding.",
};

export default function Section18() {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        You might have noticed a massive problem: If an image has 10,000 pixels, the Jacobian Matrix is a grid of 10,000 × 10,000. Calculating that determinant takes O(N³) time. It would take a supercomputer weeks to train a single image!
      </p>
      <p className="text-gray-700">
        <strong>The Solution:</strong> AI Engineers specially design the neural network layers so their Jacobian matrices are strictly <em>Triangular</em> (half of the matrix is forced to be zeros).
      </p>
      <div className="bg-white p-6 rounded-xl border border-gray-200 mt-4 shadow-sm flex flex-col items-center">
        <div className="flex gap-8 items-center w-full justify-center">
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-rose-600 mb-2">Standard Matrix: O(N³)</span>
            <div className="bg-rose-50 p-4 rounded border border-rose-200 flex flex-col items-center">
              <table className="border-l-2 border-r-2 border-rose-800 px-2 font-mono text-rose-800 font-bold text-center">
                <tbody>
                  <tr><td className="p-1">2.0</td><td className="p-1">0.5</td><td className="p-1">0.1</td></tr>
                  <tr><td className="p-1">0.3</td><td className="p-1">1.5</td><td className="p-1">0.2</td></tr>
                  <tr><td className="p-1">0.7</td><td className="p-1">0.4</td><td className="p-1">0.8</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-rose-600 mt-2 text-center max-w-[150px]">Requires insanely complex cross-multiplication.</p>
          </div>
          <ArrowRight className="text-gray-400" />
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-indigo-600 mb-2">Triangular Matrix: O(N)</span>
            <div className="bg-indigo-50 p-4 rounded border border-indigo-200 flex flex-col items-center relative">
              <div className="absolute w-[80%] h-8 bg-indigo-300/30 -rotate-45 top-10 pointer-events-none rounded"></div>
              <table className="border-l-2 border-r-2 border-indigo-800 px-2 font-mono text-indigo-800 font-bold text-center">
                <tbody>
                  <tr><td className="p-1 text-indigo-600">2.0</td><td className="p-1">0.5</td><td className="p-1">0.1</td></tr>
                  <tr><td className="p-1 text-gray-400">0</td><td className="p-1 text-indigo-600">1.5</td><td className="p-1">0.2</td></tr>
                  <tr><td className="p-1 text-gray-400">0</td><td className="p-1 text-gray-400">0</td><td className="p-1 text-indigo-600">0.8</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-indigo-600 mt-2 text-center max-w-[150px]">The determinant is simply the diagonal multiplied together!</p>
          </div>
        </div>
        <div className="mt-6 bg-slate-50 border border-slate-200 p-4 rounded-lg text-sm text-slate-700 w-full text-center">
          Because we use logarithms, multiplying the diagonal turns into <strong>adding the diagonal elements together</strong>. PyTorch isn't doing complex matrix algebra during training; it's literally just summing up a single diagonal line of numbers!
        </div>
      </div>
    </div>
  );
}
