export const meta = {
  title: "26. The Mechanics of Masking (Degrees)",
  subtitle: "How programmers decide where the 1s and 0s go.",
};

export default function Section26() {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        To build the Binary Mask mathematically, programmers assign an integer called a <strong>Degree (m)</strong> to every node in the network. The degree dictates what connections are allowed to exist.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* The Rules */}
        <div className="flex flex-col gap-4">
           <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
             <h4 className="font-bold text-green-700 mb-2 border-b border-green-100 pb-1">Rule 1: Hidden Layers</h4>
             <p className="text-xs text-gray-600 mb-2">A hidden node can only receive info from nodes with an <strong>equal or lower</strong> degree.</p>
             <div className="bg-green-50 p-2 rounded text-center font-mono text-green-800 text-sm font-bold border border-green-200">
               m<sup>L</sup> ≥ m<sup>L-1</sup>
             </div>
           </div>

           <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
             <h4 className="font-bold text-orange-700 mb-2 border-b border-orange-100 pb-1">Rule 2: Output Layers</h4>
             <p className="text-xs text-gray-600 mb-2">An output node must strictly look at nodes with a <strong>lower</strong> degree. This prevents an output from accidentally seeing itself!</p>
             <div className="bg-orange-50 p-2 rounded text-center font-mono text-orange-800 text-sm font-bold border border-orange-200">
               m<sup>L</sup> &gt; m<sup>L-1</sup>
             </div>
           </div>
        </div>

        {/* The Visual Node Graph */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-lg relative h-80 flex flex-col items-center justify-between">
           
           {/* Outputs */}
           <div className="flex w-full justify-around z-10">
             <div className="w-14 h-14 rounded-full bg-orange-200 border-2 border-orange-400 flex items-center justify-center font-bold text-orange-900 text-xs shadow">p(X₁)</div>
             <div className="w-14 h-14 rounded-full bg-orange-200 border-2 border-orange-400 flex items-center justify-center font-bold text-orange-900 text-xs shadow flex-col leading-tight"><span>p(X₂)</span><span className="text-[9px] font-normal">m=2</span></div>
             <div className="w-14 h-14 rounded-full bg-orange-200 border-2 border-orange-400 flex items-center justify-center font-bold text-orange-900 text-xs shadow flex-col leading-tight"><span>p(X₃)</span><span className="text-[9px] font-normal">m=3</span></div>
           </div>

           {/* Hidden */}
           <div className="flex w-2/3 justify-around z-10">
             <div className="w-14 h-14 rounded-full bg-green-200 border-2 border-green-400 flex flex-col items-center justify-center font-bold text-green-900 text-xs shadow leading-tight"><span>h₁</span><span className="text-[9px] font-normal">m=1</span></div>
             <div className="w-14 h-14 rounded-full bg-green-200 border-2 border-green-400 flex flex-col items-center justify-center font-bold text-green-900 text-xs shadow leading-tight"><span>h₂</span><span className="text-[9px] font-normal">m=2</span></div>
           </div>

           {/* Inputs */}
           <div className="flex w-full justify-around z-10">
             <div className="w-14 h-14 rounded-full bg-blue-200 border-2 border-blue-400 flex flex-col items-center justify-center font-bold text-blue-900 text-xs shadow leading-tight"><span>X₁</span><span className="text-[9px] font-normal">m=1</span></div>
             <div className="w-14 h-14 rounded-full bg-blue-200 border-2 border-blue-400 flex flex-col items-center justify-center font-bold text-blue-900 text-xs shadow leading-tight"><span>X₂</span><span className="text-[9px] font-normal">m=2</span></div>
             <div className="w-14 h-14 rounded-full bg-blue-200 border-2 border-blue-400 flex flex-col items-center justify-center font-bold text-blue-900 text-xs shadow leading-tight"><span>X₃</span><span className="text-[9px] font-normal">m=3</span></div>
           </div>

           {/* SVG Lines */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 0}}>
             <defs>
               <marker id="arrow-light" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
                 <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
               </marker>
             </defs>
             <line x1="16%" y1="240" x2="33%" y2="185" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow-light)" />
             <line x1="16%" y1="240" x2="66%" y2="185" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow-light)" />
             <line x1="50%" y1="240" x2="66%" y2="185" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow-light)" />
             <line x1="33%" y1="130" x2="50%" y2="70" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow-light)" />
             <line x1="33%" y1="130" x2="83%" y2="70" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow-light)" />
             <line x1="66%" y1="130" x2="83%" y2="70" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow-light)" />
           </svg>
        </div>

      </div>
    </div>
  );
}
