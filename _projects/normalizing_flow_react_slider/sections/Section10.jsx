import { Minimize2, Maximize2 } from 'lucide-react';
import { generateGaussianPath } from './helpers';

export const meta = {
  title: "10. Change of Variables (1D)",
  subtitle: "Stretching the rubber band changes the ink density.",
};

export default function Section10({ stretchFactor, setStretchFactor }) {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        The text introduces the <strong>Change of Variables Theorem</strong>. This is the exact math formula the neural network uses to stretch and squish the data.
      </p>
      <p className="text-gray-700">
        Remember Rule 1 from Step 2? <strong>You only have 1 block of clay (probability).</strong><br/>
        Imagine taking a thick rubber band and painting a square of wet ink on it. If you grab the rubber band and <em>stretch</em> it, the ink spreads out over a wider area. Because the total amount of ink hasn't changed, the ink's thickness (its density) goes <strong>down</strong>. If you let it <em>squish</em> back together, the ink pools up and the density goes <strong>up</strong>.
      </p>
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between text-sm font-bold text-gray-700 mb-4 px-4">
          <span className="flex items-center gap-1"><Minimize2 size={16} className="text-rose-500"/> Squish (Density UP)</span>
          <span className="flex items-center gap-1">Stretch (Density DOWN) <Maximize2 size={16} className="text-indigo-500"/></span>
        </div>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={stretchFactor}
          onChange={(e) => setStretchFactor(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-6"
        />
        <div className="relative h-48 border-b-2 border-gray-300 overflow-visible flex items-end justify-center">
          <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible absolute bottom-0">
            <path
              d={generateGaussianPath(0, stretchFactor, 100)}
              fill="#c7d2fe"
              stroke="#4f46e5"
              strokeWidth="2"
              style={{ transition: 'd 0.1s ease-out' }}
            />
            <rect
              x={200 - (20 * stretchFactor)}
              y={200 - (80 / stretchFactor)}
              width={40 * stretchFactor}
              height={80 / stretchFactor}
              fill="#4f46e5"
              fillOpacity="0.4"
              stroke="#312e81"
              strokeWidth="1"
              style={{ transition: 'all 0.1s ease-out' }}
            />
            <text x={200} y={200 - (80 / stretchFactor) - 10} textAnchor="middle" className="text-[10px] font-bold fill-indigo-900">
              Total Ink (Area) Stays Same
            </text>
          </svg>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-6">
          <div className="bg-gray-50 p-3 rounded border text-center">
            <span className="block text-xs text-gray-500 uppercase">New Density (Height)</span>
            <strong className="text-lg text-indigo-700">p_x(x)</strong>
          </div>
          <div className="flex items-center justify-center text-xl font-bold text-gray-400">=</div>
          <div className="bg-gray-50 p-3 rounded border text-center">
            <span className="block text-xs text-gray-500 uppercase">Base Density × Stretch/Squish Ratio</span>
            <strong className="text-lg text-indigo-700">p_z(z) × |dz/dx|</strong>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          The scary math term <strong>|dz/dx|</strong> is just the exact ratio of how much you stretched or squished the rubber band. We use absolute value ( <strong>| |</strong> ) because even if you stretch the rubber band backward (a negative slope), you can't have negative density!
        </p>
      </div>
    </div>
  );
}
