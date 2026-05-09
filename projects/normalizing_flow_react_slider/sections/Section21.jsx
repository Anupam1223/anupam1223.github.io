import { ArrowRight } from 'lucide-react';

export const meta = {
  title: "21. Weights vs. Jacobian (The Missing Link)",
  subtitle: "Clearing up the biggest confusion in Autoregressive Flows.",
};

export default function Section21() {
  return (
    <div className="space-y-4">
      <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-red-900 text-sm shadow-sm">
        <strong>Crucial Distinction:</strong> The Weight Matrix (W) and the Jacobian Matrix (J) are <strong>NOT</strong> the same thing. They are two completely different matrices that both exist in the model!
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-stretch mt-4">
        <div className="flex-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
          <h4 className="font-bold text-rose-800 mb-2 border-b border-rose-100 pb-1 w-full text-center">1. The Neural Network (Weights)</h4>
          <p className="text-[11px] text-gray-600 mb-3 text-center">The network calculates the scaling parameters (μ, σ). We apply a Binary Mask to the <strong>Weight Matrix (W)</strong> to physically cut the "future" wires in the code.</p>
          <table className="border-l-2 border-r-2 border-rose-400 px-1 bg-rose-50 rounded shadow-inner text-xs font-mono text-center mb-2">
            <tbody>
              <tr><td className="p-2 border border-rose-200 font-bold text-rose-700">W₁₁</td><td className="p-2 border border-rose-200 text-gray-400">0 (cut)</td><td className="p-2 border border-rose-200 text-gray-400">0 (cut)</td></tr>
              <tr><td className="p-2 border border-rose-200 font-bold text-rose-700">W₂₁</td><td className="p-2 border border-rose-200 font-bold text-rose-700">W₂₂</td><td className="p-2 border border-rose-200 text-gray-400">0 (cut)</td></tr>
              <tr><td className="p-2 border border-rose-200 font-bold text-rose-700">W₃₁</td><td className="p-2 border border-rose-200 font-bold text-rose-700">W₃₂</td><td className="p-2 border border-rose-200 font-bold text-rose-700">W₃₃</td></tr>
            </tbody>
          </table>
          <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-1 rounded">Masked Neural Network Weights</span>
        </div>
        <ArrowRight className="text-gray-400 self-center hidden md:block" />
        <div className="flex-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
          <h4 className="font-bold text-teal-800 mb-2 border-b border-teal-100 pb-1 w-full text-center">2. The Data Math (Jacobian)</h4>
          <p className="text-[11px] text-gray-600 mb-3 text-center">The Jacobian measures data stretch. Because the weight wires were cut, changing Pixel 3 mathematically has <strong>0% effect</strong> on Pixel 1.</p>
          <table className="border-l-2 border-r-2 border-teal-500 px-1 bg-teal-50 rounded shadow-inner text-xs font-mono text-center mb-2">
            <tbody>
              <tr><td className="p-2 border border-teal-200 font-bold text-teal-700">∂x₁/∂z₁</td><td className="p-2 border border-teal-200 text-gray-400">0</td><td className="p-2 border border-teal-200 text-gray-400">0</td></tr>
              <tr><td className="p-2 border border-teal-200 font-bold text-teal-700">∂x₂/∂z₁</td><td className="p-2 border border-teal-200 font-bold text-teal-700">∂x₂/∂z₂</td><td className="p-2 border border-teal-200 text-gray-400">0</td></tr>
              <tr><td className="p-2 border border-teal-200 font-bold text-teal-700">∂x₃/∂z₁</td><td className="p-2 border border-teal-200 font-bold text-teal-700">∂x₃/∂z₂</td><td className="p-2 border border-teal-200 font-bold text-teal-700">∂x₃/∂z₃</td></tr>
            </tbody>
          </table>
          <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-1 rounded">Triangular Data Jacobian</span>
        </div>
      </div>
      <div className="bg-slate-800 p-4 rounded-lg text-sm text-slate-300 w-full mt-2 border border-slate-700 text-center">
        <strong className="text-white">The Conclusion:</strong> We intentionally cripple the Neural Network's vision by cutting its wires (Masking W). This mathematical blindfold directly forces the Data's stretch matrix (J) to become a perfect Triangle!
      </div>
    </div>
  );
}
