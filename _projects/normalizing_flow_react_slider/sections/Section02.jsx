import { generateGaussianPath } from './helpers';

export const meta = {
  title: "2. The Probability Density Function (PDF)",
  subtitle: "Think of it as a block of clay.",
};

export default function Section02({ squeezeLevel, setSqueezeLevel }) {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        Instead of asking "What is the probability of exactly X?", we use a PDF (the curve below). It shows the <strong>density</strong> of likelihood.
      </p>
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div className="bg-green-50 p-3 rounded border border-green-200">
          <strong className="text-green-800 font-mono text-xs block mb-1">∫ p(x)dx = 1</strong>
          <span className="text-green-900"><strong>Rule 1:</strong> The total area under the curve is always exactly 1 (or 100%). You have exactly 1 block of clay.</span>
        </div>
        <div className="bg-purple-50 p-3 rounded border border-purple-200">
          <strong className="text-purple-800 font-mono text-xs block mb-1">p(x) &gt; 1 is OK!</strong>
          <span className="text-purple-900"><strong>Rule 2:</strong> Density is NOT probability. Use the slider below to squeeze the clay!</span>
        </div>
      </div>
      <div className="relative border border-gray-200 rounded-lg bg-white p-4">
        <svg viewBox="0 0 400 200" className="w-full h-48 overflow-visible">
          <line x1="0" y1="100" x2="400" y2="100" stroke="#ef4444" strokeWidth="1" strokeDasharray="5,5" />
          <text x="5" y="95" className="text-xs fill-red-500 font-semibold">Density = 1.0</text>
          <path
            d={generateGaussianPath(0, 1.2 - (squeezeLevel / 100) * 1.0, 100)}
            fill="url(#clayGradient)"
            stroke="#6366f1"
            strokeWidth="2"
            style={{ transition: 'd 0.1s ease-out' }}
          />
          <defs>
            <linearGradient id="clayGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
        <div className="mt-4 flex flex-col items-center">
          <label className="text-sm font-semibold text-gray-700 mb-2">Squeeze the distribution</label>
          <input
            type="range"
            min="0"
            max="100"
            value={squeezeLevel}
            onChange={(e) => setSqueezeLevel(e.target.value)}
            className="w-full max-w-xs accent-indigo-600"
          />
          <p className="text-xs text-gray-500 mt-2 text-center">
            Notice how the peak goes <strong>above 1.0</strong> when you squeeze it? The total area (amount of clay) is still 1, but it's densely packed into a narrow space!
          </p>
        </div>
      </div>
    </div>
  );
}
