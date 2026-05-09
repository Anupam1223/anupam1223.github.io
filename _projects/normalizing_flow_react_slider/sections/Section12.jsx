export const meta = {
  title: "12. The Determinant",
  subtitle: "Measuring the total change in Volume.",
};

export default function Section12({ scaleX, scaleY, setScaleX, setScaleY, determinant }) {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        If the Jacobian Matrix is a massive dashboard of stretching numbers, how do we plug that into our density formula? We need a single number that tells us the <strong>Total Volume Change</strong>.
      </p>
      <p className="text-gray-700">
        That single number is the <strong>Determinant</strong> of the Jacobian.
        Just like 1D stretch changes the ink density, expanding the 2D Area (or 3D Volume) thins out the probability density.
      </p>
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-gray-600">Stretch Width (X)</label>
            <input type="range" min="0.5" max="2.5" step="0.1" value={scaleX} onChange={(e) => setScaleX(parseFloat(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"/>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600">Stretch Height (Y)</label>
            <input type="range" min="0.5" max="2.5" step="0.1" value={scaleY} onChange={(e) => setScaleY(parseFloat(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"/>
          </div>
        </div>
        <div className="flex justify-center items-center h-48 bg-slate-50 border border-slate-200 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
          <div
            className="bg-indigo-500 opacity-60 border-2 border-indigo-900 absolute flex items-center justify-center text-white font-bold text-xs"
            style={{ width: `${40 * scaleX}px`, height: `${40 * scaleY}px`, transition: 'all 0.1s linear' }}
          />
        </div>
        <div className="mt-4 flex justify-between items-center bg-gray-100 p-3 rounded-lg border border-gray-300">
          <div className="text-sm font-bold text-gray-700">Determinant = Area Multiplier</div>
          <div className="text-2xl font-black text-indigo-600">{determinant}x</div>
        </div>
        <p className="text-[11px] text-gray-500 mt-2 text-center">
          Formula: <code>p_x(x) = p_z(z) × |det(Jacobian)|</code>. If the Determinant is 2.0, the space doubled in size, meaning the probability density is cut in half to conserve the "ink"!
        </p>
      </div>
    </div>
  );
}
