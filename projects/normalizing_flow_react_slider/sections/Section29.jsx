import { CheckCircle2, Zap } from 'lucide-react';

export const meta = {
  title: "29. The Block-Triangular Jacobian",
  subtitle: "Erasing the complex neural network from the math.",
};

export default function Section29() {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        Because Half A (Y₁) passes through identically, and Half A calculates the parameters for Half B (Y₂), the Jacobian Matrix forms four distinct blocks:
      </p>

      <div className="flex flex-col md:flex-row gap-6 mt-4 items-center justify-center">
         
         {/* The Matrix */}
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg relative flex items-center justify-center w-[250px] h-[250px]">
            <div className="absolute left-2 top-2 bottom-2 w-4 border-l-4 border-t-4 border-b-4 border-slate-800 rounded-l-lg"></div>
            <div className="absolute right-2 top-2 bottom-2 w-4 border-r-4 border-t-4 border-b-4 border-slate-800 rounded-r-lg"></div>
            
            <div className="grid grid-cols-2 gap-4 w-full h-full p-4 relative z-10">
               <div className="flex flex-col items-center justify-center bg-blue-50 border border-blue-200 rounded p-2 text-center">
                  <span className="text-[9px] text-gray-500 mb-1">∂Y₁ / ∂X₁</span>
                  <strong className="text-xl text-blue-700">I</strong>
                  <span className="text-[8px] text-blue-600 mt-1">Identity</span>
               </div>
               <div className="flex flex-col items-center justify-center bg-green-50 border-2 border-green-400 rounded p-2 text-center shadow-[0_0_15px_rgba(74,222,128,0.3)]">
                  <span className="text-[9px] text-gray-500 mb-1">∂Y₁ / ∂X₂</span>
                  <strong className="text-3xl text-green-600">0</strong>
                  <span className="text-[8px] text-green-700 mt-1">No relation!</span>
               </div>
               <div className="flex flex-col items-center justify-center bg-slate-100 border border-slate-300 rounded p-2 text-center">
                  <span className="text-[9px] text-gray-500 mb-1">∂Y₂ / ∂X₁</span>
                  <strong className="text-xl text-slate-700">A</strong>
                  <span className="text-[8px] text-slate-500 mt-1">NN Derivs</span>
               </div>
               <div className="flex flex-col items-center justify-center bg-rose-50 border border-rose-200 rounded p-2 text-center">
                  <span className="text-[9px] text-gray-500 mb-1">∂Y₂ / ∂X₂</span>
                  <strong className="text-sm text-rose-700 font-mono">diag<br/>(exp(s))</strong>
               </div>
            </div>
         </div>

         <div className="flex flex-col gap-4 flex-1">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm">
               <h4 className="font-bold text-green-800 mb-1 flex items-center gap-2"><CheckCircle2 size={16}/> The Diagonal Rule</h4>
               <p className="text-xs text-green-700 leading-relaxed">Because the Top-Right block is exactly <strong>0</strong>, the entire matrix becomes a "Lower Triangular Block Matrix".</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 shadow-sm">
               <h4 className="font-bold text-indigo-800 mb-1 flex items-center gap-2"><Zap size={16}/> The Math Shortcut</h4>
               <p className="text-xs text-indigo-700 leading-relaxed">The determinant of a triangular matrix is just the product of its diagonal. The massive, terrifying Neural Network derivatives (Block A) are <strong>mathematically multiplied by zero and erased!</strong></p>
            </div>
            <div className="bg-slate-800 text-white p-3 rounded-lg text-center font-mono text-sm border border-slate-600 shadow-inner">
               log |det(J)| = Σ s(X₁)
            </div>
         </div>

      </div>
    </div>
  );
}
