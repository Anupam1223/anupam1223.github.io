export const meta = {
  title: "34. Volume Penalty: Shift vs. Stretch",
  subtitle: "Why the Jacobian completely ignores the t variable.",
};

export default function Section34() {
  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-gray-700">
        Do we calculate loss on s and t? We calculate loss directly on <strong>s</strong>, but we NEVER calculate loss directly on <strong>t</strong>. Here is the elegant reason why:
      </p>
      
      <div className="flex flex-col md:flex-row gap-6 mt-4">
         {/* Translation (t) */}
         <div className="flex-1 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
            <h4 className="font-bold text-indigo-800 mb-4 w-full text-center border-b border-indigo-100 pb-2">Translation (t): No Stretch</h4>
            
            <div className="w-full bg-indigo-50 h-32 rounded-lg border border-indigo-200 flex items-center justify-center relative overflow-hidden mb-4">
               <div className="w-16 h-16 bg-indigo-500 rounded border-2 border-indigo-700 shadow-lg flex items-center justify-center text-white text-[10px] font-bold animate-[var(--anim-shift)]"
                    style={{'--anim-shift': 'shift-block 3s ease-in-out infinite', animation: 'shift-block 3s ease-in-out infinite'}}>1 lb clay</div>
               <style>{`@keyframes shift-block { 0%, 100% { transform: translateX(-40px); } 50% { transform: translateX(40px); } }`}</style>
               <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(#c7d2fe 1px, transparent 1px), linear-gradient(90deg, #c7d2fe 1px, transparent 1px)', backgroundSize: '16px 16px', opacity: 0.5, zIndex: 0}}></div>
            </div>
            
            <p className="text-xs text-slate-600 text-center leading-relaxed">
               <strong>The variable t is added to the data (a shift).</strong> Imagine a 1-pound block of clay resting on a table. If I pick up the clay and move it 5 inches to the left (applying t), did the volume change? <strong>No.</strong>
            </p>
            <div className="mt-3 bg-indigo-100 text-indigo-900 text-[11px] font-bold px-3 py-1.5 rounded-full w-full text-center">Jacobian Determinant Ignores t</div>
         </div>

         {/* Scale (s) */}
         <div className="flex-1 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
            <h4 className="font-bold text-teal-800 mb-4 w-full text-center border-b border-teal-100 pb-2">Scale (s): The Stretch</h4>
            
            <div className="w-full bg-teal-50 h-32 rounded-lg border border-teal-200 flex items-center justify-center relative overflow-hidden mb-4">
               <div className="w-16 h-16 bg-teal-500 rounded border-2 border-teal-700 shadow-lg flex items-center justify-center text-white text-[10px] font-bold whitespace-nowrap"
                    style={{animation: 'stretch-block 3s ease-in-out infinite'}}>Ink Density</div>
               <style>{`@keyframes stretch-block { 0%, 100% { transform: scaleX(1); opacity: 1; } 50% { transform: scaleX(2.5); opacity: 0.5; } }`}</style>
               <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(#99f6e4 1px, transparent 1px), linear-gradient(90deg, #99f6e4 1px, transparent 1px)', backgroundSize: '16px 16px', opacity: 0.5, zIndex: 0}}></div>
            </div>
            
            <p className="text-xs text-slate-600 text-center leading-relaxed">
               <strong>The variable s multiplies the data (a scale).</strong> If I multiply data by exp(s), I stretch the rubber band! That means the density of the probability ink just got cut in half.
            </p>
            <div className="mt-3 bg-teal-100 text-teal-900 text-[11px] font-bold px-3 py-1.5 rounded-full w-full text-center">Jacobian Determinant IS exp(s)!</div>
         </div>
      </div>
    </div>
  );
}
