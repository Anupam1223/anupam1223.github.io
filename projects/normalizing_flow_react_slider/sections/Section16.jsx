export const meta = {
  title: "16. Calculating Loss & Backprop",
  subtitle: "Using the formula ONCE at the very end.",
};

export default function Section16() {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        Now that the forward pass is complete, we hand our two final values (<code>z = [1.2, -0.1]</code> and <code>Total_LogDet = 0.8</code>) over to the Loss Function.
      </p>
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 border border-indigo-200">1</div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800 mb-1">Evaluate Blueprint Score: <code className="text-indigo-600 font-normal">log p_z(z)</code></p>
              <p className="text-xs text-slate-600">We plug <code>[1.2, -0.1]</code> into the Gaussian equation to score how close it landed to the center [0,0]. Let's say it scores <strong className="text-rose-500">-2.1</strong>.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-600 border border-teal-200">2</div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800 mb-1">Apply Formula: <code className="text-teal-600 font-normal">Score = Blueprint + Total_LogDet</code></p>
              <p className="text-xs text-slate-600">We add our accumulated stretch. Final Score = <code>-2.1 + 0.8</code> = <strong className="text-rose-500">-1.3</strong>.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center font-bold text-rose-600 border border-rose-200">3</div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800 mb-1">Define Loss & Backpropagate: <code className="text-rose-600 font-normal">loss.backward()</code></p>
              <p className="text-xs text-slate-600">Optimizers minimize to 0, so we multiply the score by -1 to get Negative Log-Likelihood (<strong>Loss = 1.3</strong>). PyTorch sends this error backward to update weights in Layers 2 and 1.</p>
            </div>
          </div>
        </div>
        <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded p-3 text-xs text-indigo-900 text-center shadow-inner">
          <strong>No Reversing During Training!</strong> We push X forward, calculate Jacobians, calculate Loss, and update weights. Reversing the network (Z → X) is <em>only</em> done after training is totally finished to generate new data!
        </div>
      </div>
    </div>
  );
}
