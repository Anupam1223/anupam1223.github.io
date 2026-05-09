export const meta = {
  title: "8. The Code Behind the Canvas",
  subtitle: "Mapping your PyTorch code to our analogies.",
};

export default function Section08() {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        Let's look at the Python code you found! It directly matches our "Gotcha" concepts. PyTorch handles all the complex math for us.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-xl text-xs font-mono overflow-x-auto shadow-inner border border-gray-800">
          <div className="mb-3 text-indigo-400"># 1. Define the Blueprint (Z)</div>
          <div>loc = torch.<span className="text-blue-400">zeros</span>(2)</div>
          <div>cov = torch.<span className="text-blue-400">eye</span>(2)</div>
          <div className="mb-3">base_dist = <span className="text-yellow-200">MultivariateNormal</span>(loc, cov)</div>
          <div className="mb-3 text-rose-400"># 2. Generating Phase (Z → X)</div>
          <div className="mb-3">z_samples = base_dist.<span className="text-yellow-200">sample</span>((5,))</div>
          <div className="mb-1 text-green-400"># 3. The Inspector (Scoring)</div>
          <div>log_probs = base_dist.<span className="text-yellow-200">log_prob</span>(z_samples)</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded-r-lg">
            <strong className="text-indigo-800 text-sm block">1. The Blueprint</strong>
            <p className="text-xs text-indigo-900 mt-1">Setting <code>loc=zeros</code> and <code>cov=eye</code> is just the mathematical way of saying "I want a perfectly centered, standard bell curve as my target shape."</p>
          </div>
          <div className="bg-rose-50 border-l-4 border-rose-500 p-3 rounded-r-lg">
            <strong className="text-rose-800 text-sm block">2. Generating</strong>
            <p className="text-xs text-rose-900 mt-1"><code>.sample()</code> reaches into the perfect bell curve and grabs a random piece of clay. We feed this into the network backward to make new data.</p>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg">
            <strong className="text-green-800 text-sm block">3. The Inspector</strong>
            <p className="text-xs text-green-900 mt-1"><code>.log_prob()</code> is the Inspector grading the network! It returns a score of how well the network is matching the blueprint.</p>
          </div>
        </div>
      </div>
      <div className="mt-6 border-t border-gray-200 pt-6">
        <h4 className="font-bold text-gray-800 mb-2">Why "log_prob" instead of "prob"? (Underflow)</h4>
        <p className="text-sm text-gray-600 mb-4">
          To calculate the total score of thousands of data points, we have to combine their individual probabilities. Look at what happens to a computer when we use standard math vs. log math:
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold text-red-600 mb-2">Standard Probability (Multiplying)</span>
            <div className="font-mono text-sm text-red-800 break-all leading-tight">
              0.1 × 0.1 × 0.1 × 0.1...
              <div className="my-2 border-t border-red-200 w-full"></div>
              = 0.00000000000...<span className="font-bold text-red-500">1</span>
            </div>
            <span className="text-xs text-red-700 mt-3 bg-red-100 px-2 py-1 rounded font-semibold">Computer rounds to 0 (Crashes!)</span>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold text-emerald-600 mb-2">Logarithmic Math (Adding)</span>
            <div className="font-mono text-sm text-emerald-800 leading-tight">
              log(0.1) + log(0.1) + log(0.1)...<br/>
              (-1) + (-1) + (-1)...
              <div className="my-2 border-t border-emerald-200 w-full"></div>
              = -3.0
            </div>
            <span className="text-xs text-emerald-700 mt-3 bg-emerald-100 px-2 py-1 rounded font-semibold">Stable numbers! (PyTorch is happy)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
