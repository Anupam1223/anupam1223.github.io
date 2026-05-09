export const meta = {
  title: "19. Autoregressive Dependency (The Chain Rule)",
  subtitle: "Predicting the present by strictly looking at the past.",
};

export default function Section19() {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        We know we need a <strong>Triangular Jacobian</strong> to make the math fast. But how do we actually force a neural network to create one? We use <strong>Autoregressive Models</strong>.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
          <h4 className="font-bold text-indigo-800 mb-4 border-b border-indigo-100 pb-2 w-full text-center">Sequential Dependency Structure</h4>
          <div className="relative w-48 h-80 flex flex-col items-center justify-between">
            <div className="w-12 h-12 rounded-full bg-indigo-100 border-2 border-indigo-400 flex items-center justify-center font-bold text-indigo-800 z-10">x₁</div>
            <div className="w-12 h-12 rounded-full bg-indigo-100 border-2 border-indigo-400 flex items-center justify-center font-bold text-indigo-800 z-10 ml-12">x₂</div>
            <div className="w-12 h-12 rounded-full bg-indigo-100 border-2 border-indigo-400 flex items-center justify-center font-bold text-indigo-800 z-10">x₃</div>
            <div className="text-gray-400 font-bold z-10">...</div>
            <div className="w-12 h-12 rounded-full bg-indigo-100 border-2 border-indigo-400 flex items-center justify-center font-bold text-indigo-800 z-10">xₙ</div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 0}}>
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#9ca3af" />
                </marker>
              </defs>
              <line x1="96" y1="45" x2="114" y2="72" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <path d="M 86 45 Q 60 110 86 172" fill="none" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <path d="M 106 45 Q 150 160 106 270" fill="none" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="108" y1="120" x2="96" y2="148" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="120" y1="124" x2="108" y2="270" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="96" y1="196" x2="96" y2="216" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="96" y1="240" x2="108" y2="270" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead)" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-[#0f172a] p-5 rounded-xl border border-gray-800 shadow-md flex flex-col items-center">
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-3">The Factorization Formula</span>
            <div className="flex items-center text-white font-mono text-lg md:text-2xl font-bold">
              <span>p(x) = </span>
              <div className="flex flex-col items-center mx-2 relative top-1">
                <span className="text-[10px] text-gray-400 -mb-1">n</span>
                <span className="text-4xl leading-none text-indigo-400 font-light">∏</span>
                <span className="text-[10px] text-gray-400 -mt-1">i=1</span>
              </div>
              <span>p(x<sub>i</sub> | x<sub>1</sub>, ..., x<sub>i-1</sub>)</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-3 text-center">The joint probability is strictly factored so each variable is conditioned ONLY on the variables before it.</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-teal-800 mb-2 border-b border-teal-100 pb-1">Breaking down the math:</h4>
            <ul className="text-sm space-y-2 text-gray-600">
              <li><strong>x₁</strong> is completely unconditional (looks at nothing).</li>
              <li><strong>x₂</strong> looks <em>only</em> at x₁.</li>
              <li><strong>x₃</strong> looks <em>only</em> at x₁ and x₂.</li>
              <li>This forces a strict, one-way flow of information through the data space.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
