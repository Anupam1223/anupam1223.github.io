import { Play, RotateCcw } from 'lucide-react';
import { generateGaussianPath, generateComplexPath } from './helpers';

export const meta = {
  title: "4. The Normalizing Flow",
  subtitle: "Molding the clay with math.",
};

export default function Section04({ isFlowing, setIsFlowing }) {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        We want our AI to generate complex real-world data. But we only know how to easily generate simple bell-curve data.
      </p>
      <p className="text-gray-700">
        A <strong>Normalizing Flow</strong> is an invertible mathematical transformation. It acts like a mold or a funhouse mirror: it stretches, squishes, and shifts the simple Latent Space (Z) into the complex Data Space (X).
      </p>
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 relative overflow-hidden flex flex-col items-center">
        <svg viewBox="0 0 400 200" className="w-full h-48 mb-4">
          <path
            d={isFlowing ? generateComplexPath(400, 200) : generateGaussianPath(0, 1.2, 120, 400, 200)}
            fill={isFlowing ? "#fecdd3" : "#c7d2fe"}
            stroke={isFlowing ? "#e11d48" : "#4f46e5"}
            strokeWidth="3"
            style={{ transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <button
          onClick={() => setIsFlowing(!isFlowing)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-colors ${
            isFlowing ? 'bg-rose-500 hover:bg-rose-600' : 'bg-indigo-500 hover:bg-indigo-600'
          }`}
        >
          {isFlowing ? (
            <><RotateCcw size={18} /> Revert to Simple Base (Z)</>
          ) : (
            <><Play size={18} /> Apply Normalizing Flow (to X)</>
          )}
        </button>
        <p className="text-xs text-center text-slate-500 mt-4 max-w-md">
          Because the math is "invertible", we can train the AI by taking real data (X), flowing it backwards into simple clay (Z), and adjusting our "mold" until the clay forms a perfect bell curve!
        </p>
      </div>
    </div>
  );
}
