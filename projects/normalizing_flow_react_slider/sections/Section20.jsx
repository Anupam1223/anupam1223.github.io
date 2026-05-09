import { ArrowRight } from 'lucide-react';

export const meta = {
  title: "20. The Autoregressive Transformation & Jacobian",
  subtitle: "Why the sequential rule creates the Triangular cheat code.",
};

export default function Section20() {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        To use this structure in a Normalizing Flow, we map our simple blueprint (Z) to our complex data (X) using this specific autoregressive function:
      </p>
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-center">
            <code className="text-indigo-800 text-lg font-bold font-mono bg-indigo-50 px-3 py-1 rounded">x<sub>i</sub> = f<sub>i</sub>(z<sub>i</sub> ; θ(x<sub>&lt;i</sub>))</code>
            <p className="text-xs text-gray-600 mt-3 text-left">
              The output pixel <code>x_i</code> depends directly on its own latent noise <code>z_i</code>, but the <em>parameters/weights</em> doing the warping (θ) are strictly wired to only look at previously generated pixels <code>x_&lt;i</code>.
            </p>
          </div>
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm flex-1">
            <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">The Math Translation:</h4>
            <ul className="text-xs space-y-3 font-mono text-slate-700">
              <li><span className="bg-indigo-100 text-indigo-800 px-1 rounded">x₁</span> = f₁( <span className="text-teal-600">z₁</span> )</li>
              <li><span className="bg-indigo-100 text-indigo-800 px-1 rounded">x₂</span> = f₂( <span className="text-teal-600">z₂</span> ; θ(<span className="text-rose-500">x₁</span>) )</li>
              <li><span className="bg-indigo-100 text-indigo-800 px-1 rounded">x₃</span> = f₃( <span className="text-teal-600">z₃</span> ; θ(<span className="text-rose-500">x₁, x₂</span>) )</li>
            </ul>
          </div>
        </div>
        <ArrowRight className="text-gray-400 self-center hidden md:block" />
        <div className="flex-1 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
          <h4 className="font-bold text-teal-800 mb-2 border-b border-teal-100 pb-1 w-full text-center">Resulting Jacobian</h4>
          <p className="text-[11px] text-gray-600 mb-4 text-center">Because <code>x₁</code> NEVER looks at <code>z₂</code> or <code>z₃</code>, the derivative (stretch) for those relationships is mathematically forced to be exactly 0!</p>
          <table className="border-l-2 border-r-2 border-teal-800 px-3 py-2 font-mono text-sm text-center bg-teal-50 rounded shadow-inner">
            <tbody>
              <tr>
                <td className="p-3 text-teal-700 font-bold border-b border-r border-teal-200">∂x₁/∂z₁</td>
                <td className="p-3 text-gray-300 font-bold border-b border-r border-teal-200">0</td>
                <td className="p-3 text-gray-300 font-bold border-b border-teal-200">0</td>
              </tr>
              <tr>
                <td className="p-3 text-teal-700 font-bold border-b border-r border-teal-200">∂x₂/∂z₁</td>
                <td className="p-3 text-teal-700 font-bold border-b border-r border-teal-200">∂x₂/∂z₂</td>
                <td className="p-3 text-gray-300 font-bold border-b border-teal-200">0</td>
              </tr>
              <tr>
                <td className="p-3 text-teal-700 font-bold border-r border-teal-200">∂x₃/∂z₁</td>
                <td className="p-3 text-teal-700 font-bold border-r border-teal-200">∂x₃/∂z₂</td>
                <td className="p-3 text-teal-700 font-bold">∂x₃/∂z₃</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-center text-teal-700 mt-4 font-bold bg-white py-1.5 px-3 rounded border border-teal-200 shadow-sm">
            Determinant = Product of the Diagonal!
          </p>
        </div>
      </div>
    </div>
  );
}
