import { ArrowRight } from 'lucide-react';
import { generateBlendedPath } from './helpers';

export const meta = {
  title: "6. Layer by Layer Learning",
  subtitle: "Ironing out the wrinkles, one hidden layer at a time.",
};

export default function Section06() {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        <strong>Yes, you nailed it!</strong> The neural network <em>learns</em> to transform the data into a bell curve over a series of steps.
      </p>
      <p className="text-gray-700">
        During training, we feed the messy Real Data (X) into the first layer of the network. Each hidden layer applies a tiny mathematical tweak to the data. By the time the data reaches the final layer, the network has gradually "ironed out" all the complex bumps <strong>until the data perfectly matches the pre-chosen blueprint (Z)</strong> we talked about in Step 5.
      </p>
      <div className="bg-white p-6 rounded-xl border border-gray-200 mt-4 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[600px] gap-2">
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-rose-600 mb-2">Input Data (X)</span>
            <svg viewBox="0 0 120 60" className="w-20">
              <path d={generateBlendedPath(0)} fill="#fecdd3" stroke="#e11d48" strokeWidth="2" />
            </svg>
          </div>
          <ArrowRight className="text-gray-400" size={16} />
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-gray-500 mb-2">Hidden Layer 1</span>
            <svg viewBox="0 0 120 60" className="w-20">
              <path d={generateBlendedPath(0.33)} fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
            </svg>
          </div>
          <ArrowRight className="text-gray-400" size={16} />
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-gray-500 mb-2">Hidden Layer 2</span>
            <svg viewBox="0 0 120 60" className="w-20">
              <path d={generateBlendedPath(0.66)} fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
            </svg>
          </div>
          <ArrowRight className="text-gray-400" size={16} />
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-indigo-600 mb-2">Output (Z)</span>
            <svg viewBox="0 0 120 60" className="w-20">
              <path d={generateBlendedPath(1)} fill="#c7d2fe" stroke="#4f46e5" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <p className="text-xs text-center text-gray-500 mt-6 bg-gray-50 p-3 rounded-lg">
          <strong>Generative Phase:</strong> When we want to generate <strong>new data</strong>, we just flip the arrows! We start with Z on the right, run the network backward layer-by-layer, and a new X (like an image or speech) pops out on the left.
        </p>
      </div>
    </div>
  );
}
