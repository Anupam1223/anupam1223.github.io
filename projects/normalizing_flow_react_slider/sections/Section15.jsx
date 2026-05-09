export const meta = {
  title: "15. The Final Boss Formula",
  subtitle: "The Log-Likelihood Objective Function.",
};

export default function Section15({ formulaView, renderFormulaToggle }) {
  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-gray-700">
        Let's put it all together. Toggle below to see why the textbook uses a minus, while your actual PyTorch code will use a plus!
      </p>
      {renderFormulaToggle()}
      <div className="bg-[#0f172a] p-6 rounded-xl border border-gray-800 shadow-xl relative mt-4 transition-colors">
        <div className="text-center font-mono text-lg md:text-xl font-bold tracking-wider mb-8">
          <span className="text-white">log p<sub>x</sub>(x)</span>
          <span className="text-gray-400 mx-3">=</span>
          <span className="text-indigo-400">log p<sub>z</sub>(z)</span>
          {formulaView === 'textbook' ? (
            <span className="text-rose-400 mx-3 text-2xl font-black transition-all">-</span>
          ) : (
            <span className="text-teal-400 mx-3 text-2xl font-black transition-all">+</span>
          )}
          <span className={formulaView === 'textbook' ? "text-rose-400" : "text-teal-400"}>log |det(J)|</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center text-center">
            <span className="text-white font-bold text-sm mb-1 bg-gray-800 px-2 py-1 rounded w-full">log p<sub>x</sub>(x)</span>
            <span className="text-xs text-gray-400 mt-2"><strong>The Final Score.</strong> The exact probability density of the real data we want to maximize.</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-indigo-400 font-bold text-sm mb-1 bg-indigo-900/30 px-2 py-1 rounded w-full">log p<sub>z</sub>(z)</span>
            <span className="text-xs text-indigo-300 mt-2"><strong>The Blueprint Match.</strong> Does the data look like the perfect bell curve we asked for?</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className={`${formulaView === 'textbook' ? 'text-rose-400 bg-rose-900/30' : 'text-teal-400 bg-teal-900/30'} font-bold text-sm mb-1 px-2 py-1 rounded w-full transition-colors`}>
              {formulaView === 'textbook' ? '-' : '+'} log |det(J)|
            </span>
            <span className={`text-xs ${formulaView === 'textbook' ? 'text-rose-300' : 'text-teal-300'} mt-2 transition-colors`}>
              {formulaView === 'textbook' ? <strong>The Volume Penalty.</strong> : <strong>The Accumulated Stretch.</strong>}
              {formulaView === 'textbook'
                ? " (Subtracted because we measured the reverse direction!)"
                : " (Added because PyTorch natively calculates the training direction!)"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
