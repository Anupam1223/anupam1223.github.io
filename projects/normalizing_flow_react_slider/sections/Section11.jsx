import { ArrowRight } from 'lucide-react';

export const meta = {
  title: "11. High Dimensions & The Jacobian",
  subtitle: "From Rubber Bands to Rubber Sheets.",
};

export default function Section11() {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        Real AI models don't stretch 1D lines; they stretch highly complex, multi-dimensional spaces (like 1024-pixel images). Instead of a rubber band, imagine a 2D rubber sheet.
      </p>
      <p className="text-gray-700">
        When you pull a rubber sheet horizontally, it often gets thinner vertically. Every dimension affects every other dimension! A simple scalar derivative (<code>dz/dx</code>) can't track this.
      </p>
      <div className="bg-white p-6 rounded-xl border border-gray-200 mt-4 shadow-sm flex flex-col items-center">
        <div className="flex gap-8 items-center w-full justify-center">
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-indigo-600 mb-2">1D Stretch (Scalar)</span>
            <div className="bg-indigo-50 p-4 rounded border border-indigo-200">
              <code className="text-indigo-800 font-bold">dz/dx = 2.0</code>
              <p className="text-[10px] text-indigo-600 mt-1 text-center max-w-[100px]">Just one number tracking one direction.</p>
            </div>
          </div>
          <ArrowRight className="text-gray-400" />
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-rose-600 mb-2">2D Stretch (Jacobian Matrix)</span>
            <div className="bg-rose-50 p-4 rounded border border-rose-200 flex flex-col items-center">
              <table className="border-l-2 border-r-2 border-rose-800 px-2 font-mono text-rose-800 font-bold text-center">
                <tbody>
                  <tr><td className="p-1">2.0</td><td className="p-1">-0.5</td></tr>
                  <tr><td className="p-1">0.1</td><td className="p-1">1.5</td></tr>
                </tbody>
              </table>
              <p className="text-[10px] text-rose-600 mt-2 text-center max-w-[140px]">A grid tracking how every direction affects every other direction.</p>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-slate-50 border border-slate-200 p-4 rounded-lg text-sm text-slate-700 w-full">
          The <strong>Jacobian Matrix</strong> is simply a dashboard of numbers that tracks how the Neural Network is stretching, squishing, and warping the space across <em>all</em> dimensions at the exact same time.
        </div>
      </div>
    </div>
  );
}
