export const meta = {
  title: "9. Where is the Neural Network?",
  subtitle: "Putting your snippet into the big picture.",
};

export default function Section09() {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        You noticed a massive missing piece: <em>"I don't see any data going in the neural network or anything, I just see code building the Gaussian!"</em>
      </p>
      <p className="text-gray-700">
        You are absolutely right. The code you provided was just the setup for the <strong>Inspector</strong>. To actually train a model, we have to wrap your code together with a neural network and a dataset. Here is what the "missing" code looks like conceptually:
      </p>
      <div className="bg-[#1e1e1e] text-[#d4d4d4] p-5 rounded-xl text-sm font-mono overflow-x-auto shadow-inner border border-gray-800">
        <div className="mb-4">
          <span className="text-gray-400 block italic mb-1"># --- YOUR CODE: THE BLUEPRINT ---</span>
          <div>base_dist = <span className="text-yellow-200">MultivariateNormal</span>(zeros, eye)</div>
        </div>
        <div className="mb-4">
          <span className="text-gray-400 block italic mb-1"># --- THE MISSING PART: THE BUILDER ---</span>
          <div>flow_network = <span className="text-yellow-200">NormalizingFlowNeuralNet</span>()</div>
          <div>optimizer = torch.optim.<span className="text-yellow-200">Adam</span>(flow_network.parameters())</div>
        </div>
        <div>
          <span className="text-gray-400 block italic mb-1"># --- THE MISSING PART: THE TRAINING LOOP ---</span>
          <div><span className="text-purple-400">for</span> real_data_X <span className="text-purple-400">in</span> dataset:</div>
          <div className="ml-6 mt-2">
            <span className="text-gray-500 italic"># 1. The builder irons out the messy data</span>
            <div>z_output = flow_network(real_data_X)</div>
          </div>
          <div className="ml-6 mt-3">
            <span className="text-gray-500 italic"># 2. The Inspector grades the output using YOUR blueprint</span>
            <div><span className="text-gray-400"># Notice we use your log_prob here!</span></div>
            <div>loss = -base_dist.<span className="text-yellow-200">log_prob</span>(z_output)</div>
          </div>
          <div className="ml-6 mt-3">
            <span className="text-gray-500 italic"># 3. Send the error backward to adjust the layers</span>
            <div>loss.<span className="text-yellow-200">backward</span>()</div>
            <div>optimizer.<span className="text-yellow-200">step</span>()</div>
          </div>
        </div>
      </div>
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mt-4 text-sm text-indigo-900">
        <strong>The takeaway:</strong> The snippet you found was basically importing the grading rubric. The actual Neural Network (the Normalizing Flow) is a separate chunk of code that continuously submits its homework (<code>z_output</code>) to that grading rubric (<code>base_dist.log_prob</code>) until it gets a perfect score!
      </div>
    </div>
  );
}
