export const meta = {
  title: "1. Continuous vs. Discrete",
  subtitle: "Why we can't count exact probabilities anymore.",
};

export default function Section01() {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        <strong>Discrete variables</strong> are like rolling dice or counting people. You get exact, isolated numbers (1, 2, 3). The probability of rolling exactly a 3 is 1/6.
      </p>
      <p className="text-gray-700">
        <strong>Continuous variables</strong> are like measuring height, weight, or pouring water. You can always get more precise (1.5 liters, 1.512 liters, 1.51299 liters...).
      </p>
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 relative overflow-hidden h-48 flex flex-col justify-center items-center">
        <div className="w-full flex justify-around items-center mb-6">
          <div className="text-center">
            <div className="flex gap-2 mb-2">
              {[1,2,3].map(i => <div key={i} className="w-6 h-6 bg-blue-500 rounded-full" />)}
            </div>
            <span className="text-sm font-semibold text-blue-700">Discrete (Countable)</span>
          </div>
          <div className="text-center w-1/2">
            <div className="h-6 w-full bg-gradient-to-r from-blue-300 to-blue-600 rounded-full mb-2 relative overflow-hidden">
              <div className="absolute top-0 bottom-0 w-1 bg-white/50 animate-[ping_3s_infinite]" style={{left: '43.218%'}} />
            </div>
            <span className="text-sm font-semibold text-blue-700">Continuous (Infinite points)</span>
          </div>
        </div>
        <p className="text-sm text-blue-800 text-center px-4">
          Because there are <i>infinite</i> possible exact measurements, the chance of hitting one <strong>exact, microscopic</strong> number is basically zero. We need a new way to measure probability.
        </p>
      </div>
    </div>
  );
}
