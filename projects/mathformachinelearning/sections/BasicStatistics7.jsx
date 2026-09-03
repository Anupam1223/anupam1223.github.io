import React, { useState, useEffect } from 'react';
import { 
  Info,
  TrendingUp,
  Activity,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Target,
  BarChart2,
  AlertTriangle,
  ArrowLeftRight,
  MoveHorizontal,
  Minus,
  Maximize2,
  BoxSelect
} from 'lucide-react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ComposedChart,
  ReferenceLine,
  ReferenceDot,
  Bar,
  Area
} from 'recharts';

export const meta = {
  title: '7. Intro to Probability & Stats',
  subtitle: 'Measuring the Center and the Spread',
};

// Custom Math Notation Component
const MathExpr = ({ children }) => (
  <span className="font-serif italic text-blue-300 mx-1 text-[1.05em] whitespace-nowrap">
    {children}
  </span>
);

const HighlightBox = ({ children, icon: Icon, title, color = "blue" }) => {
  const colorMap = {
    blue: "bg-blue-900/20 border-blue-800/50 text-blue-400",
    emerald: "bg-emerald-900/20 border-emerald-800/50 text-emerald-400",
    purple: "bg-purple-900/20 border-purple-800/50 text-purple-400",
    orange: "bg-orange-900/20 border-orange-800/50 text-orange-400",
    rose: "bg-rose-900/20 border-rose-800/50 text-rose-400",
  };
  
  return (
    <div className={`border rounded-xl p-6 my-6 shadow-inner ${colorMap[color] || colorMap.blue}`}>
      {title && (
        <div className="flex items-center gap-2 mb-3">
          {Icon && <Icon className="w-5 h-5" />}
          <h4 className="font-semibold text-slate-100">{title}</h4>
        </div>
      )}
      <div className="text-slate-300 leading-relaxed">
        {children}
      </div>
    </div>
  );
};

// Standardized Slide Container with flex-grow
const SlideFrame = ({ children }) => (
  <div className="flex flex-col w-full flex-grow px-6 py-8 md:px-12 md:py-10 bg-[#111111] text-slate-200 selection:bg-blue-500/30">
    <div className="w-full max-w-5xl mx-auto space-y-6 flex flex-col flex-grow">
      {children}
    </div>
  </div>
);

const SlideMean = () => (
  <SlideFrame>
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Measuring the Center: The Mean</h2>
      <p className="text-slate-300 text-lg leading-relaxed mb-6">
        When analyzing a dataset, one of the first things we want to understand is its "center" or a typical value that represents the data. The three most common measures of central tendency are the <strong>mean</strong>, <strong>median</strong>, and <strong>mode</strong>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        <div className="flex flex-col gap-6">
           <HighlightBox icon={Target} title="The Mean (Average)" color="emerald">
              <p className="text-[15px] mb-4">
                The mean is calculated by summing all the values in a dataset and dividing by the number of values.
              </p>
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-center font-serif text-lg text-white shadow-inner overflow-x-auto whitespace-nowrap flex items-center justify-center gap-4">
                 <span className="text-emerald-400 flex flex-col items-center">
                   <span className="border-t-2 border-emerald-400 px-1">x</span>
                 </span>
                 <span>=</span>
                 <div className="flex flex-col items-center">
                   <span className="border-b border-white px-2 pb-1">x₁ + x₂ + ··· + xₙ</span>
                   <span className="pt-1 text-slate-400">n</span>
                 </div>
                 <span>=</span>
                 <div className="flex flex-col items-center">
                   <span className="border-b border-white px-2 pb-1">Σ xᵢ</span>
                   <span className="pt-1 text-slate-400">n</span>
                 </div>
              </div>
           </HighlightBox>

           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
             <h4 className="font-bold text-slate-200 mb-3 flex items-center gap-2">
               <Info className="w-5 h-5 text-blue-400"/> When to use the Mean
             </h4>
             <p className="text-sm text-slate-300 leading-relaxed">
               The mean is a great measure of the center when the data distribution is roughly <strong>symmetrical</strong> and doesn't have extreme values (outliers).
             </p>
           </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl flex flex-col items-center justify-center">
           <h3 className="font-bold text-slate-400 uppercase tracking-widest text-sm mb-6 border-b border-slate-700 pb-2 w-full text-center">
             Example Calculation
           </h3>
           <p className="text-slate-300 text-center mb-6">
             The ages of 5 people are: <span className="font-mono text-blue-300 bg-blue-900/30 px-2 py-1 rounded">22, 25, 21, 30, 22</span>
           </p>

           <div className="font-serif text-2xl text-white flex items-center gap-4 flex-wrap justify-center bg-slate-800 px-6 py-8 rounded-xl w-full shadow-inner border border-slate-700">
             <div className="flex flex-col items-center text-emerald-400">
               <span className="border-t-2 border-emerald-400 px-1">x</span>
             </div>
             <span>=</span>
             <div className="flex flex-col items-center text-blue-300">
               <span className="border-b border-slate-500 px-2 pb-2">22 + 25 + 21 + 30 + 22</span>
               <span className="pt-2 text-slate-400">5</span>
             </div>
             <span>=</span>
             <div className="flex flex-col items-center">
               <span className="border-b border-slate-500 px-2 pb-2">120</span>
               <span className="pt-2 text-slate-400">5</span>
             </div>
             <span className="text-emerald-400 font-bold ml-2">= 24</span>
           </div>

           <p className="mt-8 text-slate-400 italic text-sm text-center">
             The mean age is exactly 24 years.
           </p>
        </div>
      </div>
    </div>
  </SlideFrame>
);

const SlideMedianMode = () => {
  const [isEven, setIsEven] = useState(false);
  const [isSorted, setIsSorted] = useState(false);

  const oddData = [22, 25, 21, 30, 22];
  const oddSorted = [21, 22, 22, 25, 30];
  
  const evenData = [21, 22, 25, 30]; // Already sorted for simplicity in example

  const currentData = isEven ? evenData : (isSorted ? oddSorted : oddData);

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">The Median & The Mode</h2>
        <p className="text-slate-300 text-lg mb-6">
          While the mean calculates a mathematical average, the <strong>Median</strong> and <strong>Mode</strong> look at the data's physical position and frequency.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          
          {/* Median Interactive */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 flex flex-col relative overflow-hidden">
             <h3 className="font-bold text-blue-400 mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
               <MoveHorizontal className="w-5 h-5"/> The Median
             </h3>
             <p className="text-sm text-slate-300 mb-6">
               The median is the <strong>middle value</strong> in a dataset that has been ordered from smallest to largest. It splits the data 50/50.
             </p>

             <div className="flex justify-center gap-2 mb-6">
               <button onClick={() => {setIsEven(false); setIsSorted(false);}} className={`px-3 py-1 text-xs font-bold rounded-lg border ${!isEven ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>Odd (n=5)</button>
               <button onClick={() => {setIsEven(true); setIsSorted(true);}} className={`px-3 py-1 text-xs font-bold rounded-lg border ${isEven ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>Even (n=4)</button>
             </div>

             <div className="flex-grow flex flex-col items-center justify-center gap-6 bg-slate-800 rounded-xl border border-slate-700 p-6 relative">
               
               <div className="flex gap-2">
                 {currentData.map((val, idx) => {
                   let isMiddle = false;
                   if (!isEven && isSorted && idx === 2) isMiddle = true;
                   if (isEven && (idx === 1 || idx === 2)) isMiddle = true;

                   return (
                     <div key={idx} className={`w-12 h-12 flex items-center justify-center rounded-lg font-mono font-bold text-lg transition-all duration-500 ${isMiddle ? 'bg-blue-500 text-white scale-110 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10' : 'bg-slate-700 text-slate-400 border border-slate-600'}`}>
                       {val}
                     </div>
                   )
                 })}
               </div>

               {!isEven && !isSorted && (
                 <button onClick={() => setIsSorted(true)} className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg shadow-md animate-pulse">
                   Sort Data to Find Middle
                 </button>
               )}

               {!isEven && isSorted && (
                 <div className="text-center animate-in fade-in zoom-in duration-500">
                   <ArrowRight className="w-6 h-6 mx-auto text-blue-400 mb-2 rotate-90" />
                   <div className="bg-blue-900/50 border border-blue-500 px-4 py-2 rounded-lg font-bold text-white shadow-lg">Median = 22</div>
                 </div>
               )}

               {isEven && (
                 <div className="text-center animate-in fade-in zoom-in duration-500">
                   <div className="flex justify-center gap-6 text-blue-400 mb-2">
                     <ArrowRight className="w-5 h-5 rotate-90" />
                     <ArrowRight className="w-5 h-5 rotate-90" />
                   </div>
                   <p className="text-xs text-slate-400 mb-2">Average the two middle values:</p>
                   <div className="bg-blue-900/50 border border-blue-500 px-4 py-2 rounded-lg font-bold text-white shadow-lg font-mono">
                     (22 + 25) / 2 = 23.5
                   </div>
                 </div>
               )}
             </div>
          </div>

          {/* Mode & Rules */}
          <div className="flex flex-col gap-6">
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
               <h3 className="font-bold text-purple-400 mb-2 flex items-center gap-2 border-b border-slate-700 pb-2">
                 <BarChart2 className="w-5 h-5"/> The Mode
               </h3>
               <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                 The mode is the value that appears <strong>most frequently</strong> in a dataset. Simply count the occurrences.
               </p>
               <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                 <div className="font-mono text-sm text-slate-400 mb-2">Dataset: 22, 25, 21, 30, <span className="text-purple-400 font-bold border-b border-purple-500">22</span></div>
                 <div className="text-sm text-white">The value 22 appears twice, more than any other. <strong>Mode = 22</strong>.</div>
               </div>
             </div>

             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md flex-grow">
               <h4 className="font-bold text-slate-200 mb-4">Mode Characteristics:</h4>
               <ul className="space-y-4 text-sm text-slate-300">
                 <li className="flex items-start gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></div>
                   <span><strong>Multiple Modes:</strong> A dataset can be bimodal (2 modes) or multimodal. Example: [1, 1, 2, 3, 3] &rarr; Modes are 1 and 3.</span>
                 </li>
                 <li className="flex items-start gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></div>
                   <span><strong>No Mode:</strong> If all values appear equally, there is no mode. Example: [1, 2, 3, 4] &rarr; No Mode.</span>
                 </li>
                 <li className="flex items-start gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></div>
                   <span><strong>Categorical Data:</strong> It is the <em>only</em> measure of center for categories. Example: [Red, Blue, Blue, Green] &rarr; Mode is Blue.</span>
                 </li>
               </ul>
             </div>
          </div>

        </div>
      </div>
    </SlideFrame>
  );
};

const SlideSensitivity = () => {
  const [outlier, setOutlier] = useState(30);
  
  const basePoints = [21, 22, 22, 25];
  const allPoints = [...basePoints, outlier].sort((a,b)=>a-b);
  
  const mean = allPoints.reduce((a,b)=>a+b, 0) / 5;
  const median = allPoints[2]; // Always index 2 for n=5

  // Prepare data for Recharts (y is always 0 to force a 1D number line)
  const scatterData = allPoints.map((val, i) => ({ x: val, y: 0, isOutlier: val === outlier && i === allPoints.lastIndexOf(outlier) }));

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Sensitivity to Outliers</h2>
        <p className="text-slate-300 text-lg mb-6">
          A significant drawback of the mean is its extreme sensitivity to outliers (unusual data points). The median, however, is highly <strong>robust</strong>. Let's see this in action.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
          
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg">
              <label className="block text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider flex justify-between items-center">
                <span>Value of 5th Person:</span>
                <span className="text-white bg-slate-900 px-3 py-1 rounded text-lg border border-slate-600">{outlier} yrs</span>
              </label>
              <input 
                type="range" 
                min="20" 
                max="100" 
                step="1" 
                value={outlier} 
                onChange={(e) => setOutlier(parseInt(e.target.value))} 
                className="w-full accent-rose-500"
              />
              <p className="text-xs text-slate-500 mt-3 italic flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4"/> Drag to simulate a data entry error (e.g., 90 instead of 30).
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-inner space-y-6">
              <div>
                <div className="text-xs text-emerald-500 uppercase tracking-widest mb-1 font-bold">The Mean</div>
                <div className="font-mono text-3xl text-white font-bold">{mean.toFixed(1)}</div>
                <div className="text-xs text-slate-400 mt-1">Sum / 5</div>
              </div>
              <div className="border-t border-slate-800 pt-4">
                <div className="text-xs text-blue-500 uppercase tracking-widest mb-1 font-bold">The Median</div>
                <div className="font-mono text-3xl text-white font-bold">{median}</div>
                <div className="text-xs text-slate-400 mt-1">Middle Value</div>
              </div>
            </div>
          </div>

          {/* Interactive Chart */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-4 border border-slate-700 shadow-xl flex flex-col min-h-[350px] relative overflow-hidden">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest absolute top-4 left-4 z-10">1D Number Line</h3>
             
             <div className="w-full h-full min-h-[300px] mt-4">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart margin={{ top: 40, right: 20, bottom: 20, left: 20 }}>
                    <XAxis type="number" dataKey="x" domain={[15, 105]} stroke="#94a3b8" tickCount={10} />
                    <YAxis type="number" domain={[-1, 1]} hide />
                    
                    {/* The 1D line itself */}
                    <ReferenceLine y={0} stroke="#334155" strokeWidth={2} />

                    {/* Data Points */}
                    <Scatter data={scatterData} shape={(props) => {
                      const { cx, cy, payload } = props;
                      return (
                        <circle 
                          cx={cx} cy={cy} r={payload.isOutlier ? 8 : 6} 
                          fill={payload.isOutlier ? "#f43f5e" : "#94a3b8"} 
                          stroke={payload.isOutlier ? "#fff" : "none"}
                          strokeWidth={2}
                          className={payload.isOutlier ? "transition-all duration-300" : ""}
                        />
                      );
                    }} />

                    {/* Median Line */}
                    <ReferenceLine x={median} stroke="#3b82f6" strokeWidth={3} strokeDasharray="5 5" label={{ position: 'top', value: 'Median', fill: '#3b82f6', fontSize: 14, fontWeight: 'bold' }} />
                    
                    {/* Mean Line */}
                    <ReferenceLine x={mean} stroke="#10b981" strokeWidth={3} className="transition-all duration-300" label={{ position: 'bottom', value: 'Mean', fill: '#10b981', fontSize: 14, fontWeight: 'bold' }} />
                  </ComposedChart>
               </ResponsiveContainer>
             </div>

             <div className="text-center mt-2 text-sm text-slate-400 bg-slate-800/50 py-3 rounded-lg border border-slate-700 mx-4 mb-2">
                {outlier > 50 ? (
                  <span className="text-rose-400 font-bold flex items-center justify-center gap-2">
                    <AlertTriangle className="w-4 h-4"/> The Mean has been pulled far away from the typical cluster! The Median remains completely unaffected.
                  </span>
                ) : (
                  <span>When data is clustered, Mean and Median are similar.</span>
                )}
             </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideComparison = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Mean vs. Median vs. Mode</h2>
      <p className="text-slate-300 text-lg mb-6">
        A quick comparison matrix and a look at how these measures reveal the shape (skewness) of a distribution.
      </p>

      <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300 min-w-[600px]">
          <thead className="bg-slate-800 text-slate-200 border-b border-slate-600">
            <tr>
              <th className="p-4 font-bold">Measure</th>
              <th className="p-4 font-bold">Calculation</th>
              <th className="p-4 font-bold">Use Case</th>
              <th className="p-4 font-bold">Outlier Sensitivity</th>
              <th className="p-4 font-bold">Data Types</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
             <tr className="hover:bg-slate-800/50 transition-colors">
               <td className="p-4 font-bold text-emerald-400">Mean</td>
               <td className="p-4 font-mono text-xs">Sum / Count</td>
               <td className="p-4">Symmetrical data, no outliers</td>
               <td className="p-4 text-rose-400 font-bold">High</td>
               <td className="p-4">Numerical</td>
             </tr>
             <tr className="hover:bg-slate-800/50 transition-colors bg-slate-900/50">
               <td className="p-4 font-bold text-blue-400">Median</td>
               <td className="p-4 font-mono text-xs">Middle value (ordered)</td>
               <td className="p-4">Skewed data, data with outliers</td>
               <td className="p-4 text-emerald-400 font-bold">Low</td>
               <td className="p-4">Numerical (Ordinal)</td>
             </tr>
             <tr className="hover:bg-slate-800/50 transition-colors">
               <td className="p-4 font-bold text-purple-400">Mode</td>
               <td className="p-4 font-mono text-xs">Most frequent value</td>
               <td className="p-4">Categorical data, common value</td>
               <td className="p-4 text-emerald-400 font-bold">Low</td>
               <td className="p-4">Numerical, Categorical</td>
             </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 flex-grow">
         <div className="flex flex-col justify-center space-y-4">
           <h3 className="text-xl font-bold text-white mb-2">Clues about Distribution Shape</h3>
           <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-slate-400 shadow-sm">
             <span className="font-bold text-slate-200 block mb-1">Symmetrical Distribution</span>
             <span className="text-sm text-slate-400 font-mono">Mean ≈ Median ≈ Mode</span>
           </div>
           <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-rose-500 shadow-sm">
             <span className="font-bold text-slate-200 block mb-1">Right-Skewed (Tail to right)</span>
             <span className="text-sm text-slate-400">Outliers pull the mean higher.<br/><span className="font-mono text-rose-400">Mean &gt; Median</span></span>
           </div>
           <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-blue-500 shadow-sm">
             <span className="font-bold text-slate-200 block mb-1">Left-Skewed (Tail to left)</span>
             <span className="text-sm text-slate-400">Outliers pull the mean lower.<br/><span className="font-mono text-blue-400">Mean &lt; Median</span></span>
           </div>
         </div>

         {/* Custom SVG Histogram mimicking the exact screenshot */}
         <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 shadow-inner flex flex-col items-center justify-center relative min-h-[250px]">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest absolute top-4 left-4">Original Data: [21, 22, 22, 25, 30]</span>
            
            <svg viewBox="0 0 500 250" className="w-full h-full max-w-[400px] mt-6">
              {/* Grid Lines */}
              <line x1="50" y1="50" x2="450" y2="50" stroke="#334155" strokeDasharray="2 2" />
              <line x1="50" y1="100" x2="450" y2="100" stroke="#334155" strokeDasharray="2 2" />
              <line x1="50" y1="150" x2="450" y2="150" stroke="#334155" strokeDasharray="2 2" />

              {/* Axes */}
              <line x1="50" y1="200" x2="450" y2="200" stroke="#94a3b8" />
              <line x1="50" y1="30" x2="50" y2="200" stroke="#94a3b8" />
              
              {/* Bars (Max height 3 = 150px, 1 unit = 50px) */}
              <rect x="51" y="50" width="132" height="150" fill="#60a5fa" />
              <rect x="184" y="150" width="132" height="50" fill="#60a5fa" />
              <rect x="317" y="150" width="132" height="50" fill="#60a5fa" />

              {/* Median Line at 22 -> 50 + (2/15 * 400) = 103.3 */}
              <line x1="103.3" y1="40" x2="103.3" y2="200" stroke="#1d4ed8" strokeWidth="2" strokeDasharray="4 4" />
              <text x="103.3" y="30" fill="#60a5fa" fontSize="12" textAnchor="middle" fontWeight="bold">Median & Mode (22)</text>
              
              {/* Mean Line at 24 -> 50 + (4/15 * 400) = 156.6 */}
              <line x1="156.6" y1="60" x2="156.6" y2="200" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
              <text x="185" y="70" fill="#ef4444" fontSize="12" textAnchor="middle" fontWeight="bold">Mean (24)</text>

              {/* X Axis Labels */}
              <text x="50" y="220" fill="#94a3b8" fontSize="12" textAnchor="middle">20</text>
              <text x="183.3" y="220" fill="#94a3b8" fontSize="12" textAnchor="middle">25</text>
              <text x="316.6" y="220" fill="#94a3b8" fontSize="12" textAnchor="middle">30</text>
              <text x="450" y="220" fill="#94a3b8" fontSize="12" textAnchor="middle">35</text>

              {/* Y Axis Labels */}
              <text x="30" y="204" fill="#94a3b8" fontSize="12" textAnchor="middle">0</text>
              <text x="30" y="154" fill="#94a3b8" fontSize="12" textAnchor="middle">1</text>
              <text x="30" y="104" fill="#94a3b8" fontSize="12" textAnchor="middle">2</text>
              <text x="30" y="54" fill="#94a3b8" fontSize="12" textAnchor="middle">3</text>
            </svg>
            <p className="text-[11px] text-slate-500 mt-4 italic text-center leading-tight max-w-[300px]">
              Right-Skewed shape. The larger value of 30 acts as an outlier pulling the Mean slightly to the right of the Median.
            </p>
         </div>
      </div>
    </div>
  </SlideFrame>
);

const SlideSpreadRange = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Measuring Spread: Range</h2>
      <p className="text-slate-300 text-lg mb-8 leading-relaxed">
        While statistics like the mean or median identify the center, they do not indicate how spread out the data points are. Do they cluster tightly around the center, or are they widely scattered? Measures of <strong>dispersion</strong> (or variability) quantify this.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        
        <div className="flex flex-col gap-6">
           <HighlightBox icon={ArrowLeftRight} title="What is the Range?" color="orange">
              <p className="text-[15px] mb-4">
                The range is the simplest measure of dispersion. It is the difference between the highest value (maximum) and the lowest value (minimum) in a dataset. It gives a quick sense of the total span covered by your data.
              </p>
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-center font-serif text-lg text-white shadow-inner">
                 Range = Maximum Value − Minimum Value
              </div>
           </HighlightBox>
        </div>

        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl flex flex-col justify-center relative">
           <h3 className="font-bold text-slate-400 uppercase tracking-widest text-sm mb-6 border-b border-slate-700 pb-2 w-full">
             Example Calculation
           </h3>
           <p className="text-slate-300 mb-6 text-sm">
             Daily high temperatures (Celsius) over a week:<br/>
             <span className="font-mono text-rose-400 font-bold block mt-2 bg-rose-900/20 p-2 rounded border border-rose-900/50">[21, 25, 19, 28, 22, 26, 20]</span>
           </p>
           
           <ol className="space-y-4 text-slate-300 text-sm mb-8 list-decimal pl-5">
             <li><strong>Find the Maximum:</strong> The highest temp is 28°C.</li>
             <li><strong>Find the Minimum:</strong> The lowest temp is 19°C.</li>
             <li><strong>Calculate the Range:</strong></li>
           </ol>

           <div className="font-serif text-2xl text-white flex items-center justify-center bg-slate-800 px-6 py-6 rounded-xl w-full shadow-inner border border-slate-700">
             <span>Range = 28 - 19 = <span className="text-orange-400 font-bold">9</span></span>
           </div>
           
           <p className="mt-6 text-slate-400 italic text-xs text-center leading-tight">
             This tells us the temperatures varied by 9 degrees from the lowest to the highest point during the week.
           </p>
        </div>

      </div>
    </div>
  </SlideFrame>
);

const SlideRangeLimitations = () => {
  const [outlier, setOutlier] = useState(28);
  
  const points = [19, 20, 21, 22, 25, 26, outlier].sort((a,b)=>a-b);
  const min = points[0]; // Always 19
  const max = points[points.length-1];
  const range = max - min;

  // Prepare data for Recharts (y is 0 for points, 0.5 for the range line)
  const scatterData = points.map((val, i) => ({ x: val, y: 0, isOutlier: val === outlier && i === points.lastIndexOf(outlier) }));
  
  // The bracket/line showing the range span
  const rangeLineData = [
    { x: min, y: 0.3 },
    { x: max, y: 0.3 }
  ];

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Limitations of the Range</h2>
        <p className="text-slate-300 text-lg mb-6">
          While easy to calculate, the range has a massive limitation: <strong>it only uses the two most extreme values</strong>. This makes it incredibly sensitive to outliers.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
          
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg">
              <label className="block text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider flex justify-between items-center">
                <span>Temp on Day 7:</span>
                <span className="text-white bg-slate-900 px-3 py-1 rounded text-lg border border-slate-600">{outlier}°C</span>
              </label>
              <input 
                type="range" 
                min="26" 
                max="50" 
                step="1" 
                value={outlier} 
                onChange={(e) => setOutlier(parseInt(e.target.value))} 
                className="w-full accent-orange-500"
              />
              <p className="text-xs text-slate-500 mt-3 italic">
                Drag to simulate one unusually hot day (e.g., 45°C).
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-inner space-y-4 text-center">
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-bold">Calculated Range</div>
              <div className="font-mono text-xl text-slate-300">{max} - {min} =</div>
              <div className="font-mono text-5xl text-orange-400 font-bold">{range}</div>
            </div>
          </div>

          {/* Interactive Chart */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-4 border border-slate-700 shadow-xl flex flex-col min-h-[350px] relative overflow-hidden">
             
             <div className="w-full h-full min-h-[300px] mt-4">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <XAxis type="number" dataKey="x" domain={[15, 55]} stroke="#94a3b8" tickCount={9} />
                    <YAxis type="number" domain={[-0.5, 1]} hide />
                    
                    {/* The 1D line itself */}
                    <ReferenceLine y={0} stroke="#334155" strokeWidth={2} />

                    {/* Data Points */}
                    <Scatter data={scatterData} shape={(props) => {
                      const { cx, cy, payload } = props;
                      return (
                        <circle 
                          cx={cx} cy={cy} r={payload.isOutlier ? 8 : 6} 
                          fill={payload.isOutlier ? "#f97316" : "#94a3b8"} 
                          stroke={payload.isOutlier ? "#fff" : "none"}
                          strokeWidth={2}
                          className={payload.isOutlier ? "transition-all duration-300" : ""}
                        />
                      );
                    }} />

                    {/* Range Span Line */}
                    <Line data={rangeLineData} type="linear" dataKey="y" stroke="#f97316" strokeWidth={3} dot={false} isAnimationActive={false} />
                    
                    {/* Drop lines from range span to points */}
                    <ReferenceLine segment={[{x: min, y: 0}, {x: min, y: 0.3}]} stroke="#f97316" strokeWidth={2} />
                    <ReferenceLine segment={[{x: max, y: 0}, {x: max, y: 0.3}]} stroke="#f97316" strokeWidth={2} className="transition-all duration-300" />

                    <ReferenceDot x={(min+max)/2} y={0.35} r={0} fill="none" label={{ position: 'top', value: `Range: ${range}`, fill: '#f97316', fontSize: 16, fontWeight: 'bold' }} />

                  </ComposedChart>
               </ResponsiveContainer>
             </div>

             <div className="text-center mt-2 text-sm text-slate-400 bg-slate-800/50 py-3 rounded-lg border border-slate-700 mx-4 mb-2">
                {outlier > 35 ? (
                  <span className="text-orange-400 font-bold flex items-center justify-center gap-2">
                    <AlertTriangle className="w-4 h-4"/> The single outlier dramatically stretches the range! It gives a misleading impression of the typical variation, as the bulk of the data is still tightly clustered.
                  </span>
                ) : (
                  <span>The range perfectly captures the span of the clustered data.</span>
                )}
             </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideVariance = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Variance: The Average Squared Difference</h2>
      <p className="text-slate-300 text-lg mb-6 leading-relaxed">
        To overcome the limitations of the Range, we want to measure how much <em>every</em> data point deviates from the mean.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        
        <div className="flex flex-col gap-6">
           <HighlightBox icon={Minus} title="The Cancellation Problem" color="rose">
              <p className="text-[15px] mb-4">
                If we simply average the deviations from the mean <MathExpr>(x_i - \mu)</MathExpr>, the positive deviations (points above the mean) and negative deviations (points below the mean) perfectly cancel each other out, resulting in zero!
              </p>
              <p className="text-[15px]">
                To fix this, we <strong>square</strong> each deviation before averaging them. This is called the <strong>Variance</strong>.
              </p>
           </HighlightBox>

           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
             <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
               <Info className="w-5 h-5"/> Bessel's Correction
             </h4>
             <p className="text-sm text-slate-300 leading-relaxed">
               Notice the sample formula divides by <MathExpr>n - 1</MathExpr> instead of <MathExpr>n</MathExpr>. This makes the sample variance an <em>unbiased estimator</em> of the true population variance. It slightly inflates the variance to counteract the fact that sample data is usually clustered closer to its own sample mean than the true population mean.
             </p>
           </div>
        </div>

        <div className="flex flex-col gap-6">
           {/* Population Variance */}
           <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-center relative">
             <h3 className="font-bold text-emerald-400 uppercase tracking-widest text-sm mb-4 border-b border-slate-700 pb-2">
               Population Variance (σ²)
             </h3>
             <div className="font-serif text-2xl md:text-3xl text-white flex items-center justify-center py-4 overflow-x-auto">
               <span className="text-emerald-400 mr-4">σ²</span>
               <span>=</span>
               <div className="flex flex-col items-center mx-4">
                 <span className="border-b border-slate-400 px-4 pb-2">Σ (xᵢ - μ)²</span>
                 <span className="pt-2 text-slate-400">N</span>
               </div>
             </div>
             <p className="text-xs text-slate-500 text-center mt-2">Used when you have data for the entire population.</p>
           </div>

           {/* Sample Variance */}
           <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-center relative">
             <h3 className="font-bold text-blue-400 uppercase tracking-widest text-sm mb-4 border-b border-slate-700 pb-2">
               Sample Variance (s²)
             </h3>
             <div className="font-serif text-2xl md:text-3xl text-white flex items-center justify-center py-4 overflow-x-auto">
               <span className="text-blue-400 mr-4">s²</span>
               <span>=</span>
               <div className="flex flex-col items-center mx-4">
                 <span className="border-b border-slate-400 px-4 pb-2">Σ (xᵢ - x̄)²</span>
                 <span className="pt-2 text-slate-400">n - 1</span>
               </div>
             </div>
             <p className="text-xs text-slate-500 text-center mt-2">Used when you have a sample (subset) of the population.</p>
           </div>
        </div>

      </div>
    </div>
  </SlideFrame>
);

const SlideStandardDeviation = () => {
  // Data simulating a histogram of two distributions
  const distributionData = [
    { bin: '40-50',  lowSD: 0, highSD: 1 },
    { bin: '50-60',  lowSD: 0, highSD: 1 },
    { bin: '60-70',  lowSD: 0, highSD: 1 },
    { bin: '70-80',  lowSD: 2, highSD: 1 },
    { bin: '80-90',  lowSD: 2, highSD: 1 },
    { bin: '90-100', lowSD: 0, highSD: 1 },
    { bin: '100-110',lowSD: 0, highSD: 1 },
  ];

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Standard Deviation</h2>
        <p className="text-slate-300 text-lg mb-6">
          One drawback of variance is its units. If your data is in centimeters (cm), the variance is in cm², making it hard to interpret. <strong>Standard Deviation</strong> fixes this by taking the square root.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
          
          <div className="lg:col-span-1 flex flex-col gap-6">
             <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-md">
               <h3 className="font-bold text-emerald-400 uppercase tracking-widest text-sm mb-4 border-b border-slate-700 pb-2">Sample Standard Deviation (s)</h3>
               <div className="font-serif text-2xl text-white flex items-center justify-center py-2">
                 <span className="text-blue-400 mr-3">s</span>
                 <span>= √</span>
                 <span className="border-t border-slate-400 pt-1 ml-1">s²</span>
               </div>
               <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                 It provides a measure of the <em>typical</em> or <em>average distance</em> of data points from the mean, back in the original units.
               </p>
             </div>

             <div className="bg-slate-800 p-5 rounded-xl border-l-4 border-blue-500 shadow-md">
               <h4 className="font-bold text-blue-400 mb-1">Low Standard Deviation</h4>
               <p className="text-sm text-slate-300">Data points tend to be very close to the mean. The distribution curve is tall and narrow.</p>
             </div>

             <div className="bg-slate-800 p-5 rounded-xl border-l-4 border-rose-500 shadow-md">
               <h4 className="font-bold text-rose-400 mb-1">High Standard Deviation</h4>
               <p className="text-sm text-slate-300">Data points are spread out over a wider range. The distribution curve is shorter and wider.</p>
             </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl flex flex-col min-h-[350px]">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Visualizing Spread</h3>
             
             <div className="w-full h-full min-h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={distributionData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="bin" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" domain={[0, 2.5]} tickCount={6} />
                    
                    <Bar dataKey="lowSD" fill="#3b82f6" name="Dataset A (Low SD)" barSize={40} />
                    <Bar dataKey="highSD" fill="#f43f5e" name="Dataset B (High SD)" opacity={0.6} barSize={60} />
                    
                    {/* Fake Legend */}
                    <ReferenceDot x={1} y={2.2} r={0} fill="none" label={{ position: 'right', value: '■ Dataset A (Low SD)', fill: '#3b82f6', fontSize: 12, fontWeight: 'bold' }} />
                    <ReferenceDot x={1} y={2.0} r={0} fill="none" label={{ position: 'right', value: '■ Dataset B (High SD)', fill: '#f43f5e', fontSize: 12, fontWeight: 'bold', opacity: 0.8 }} />
                  </ComposedChart>
               </ResponsiveContainer>
             </div>

             <div className="text-center mt-2 text-sm text-slate-400 bg-slate-800/50 py-3 rounded-lg border border-slate-700">
                Both datasets have a mean around 75. <span className="text-blue-400 font-bold">Dataset A</span> is clustered tightly. <span className="text-rose-400 font-bold">Dataset B</span> is spread much wider.
             </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlidePercentilesQuartiles = () => {
  // Fake histogram data to represent Quartiles
  const quartileData = [
    { x: 100, y: 0, area: 'Q1' },
    { x: 120, y: 1, area: 'Q1' },
    { x: 140, y: 2, area: 'Q1' },
    { x: 158.75, y: 4, area: 'Med' }, // Q1 Line
    { x: 170, y: 5, area: 'Med' },
    { x: 185, y: 6, area: 'Q3' },   // Median Line
    { x: 200, y: 5, area: 'Q3' },
    { x: 220, y: 3, area: 'Q3' },
    { x: 235, y: 2, area: 'Max' },  // Q3 Line
    { x: 260, y: 1, area: 'Max' },
    { x: 300, y: 0, area: 'Max' },
  ];

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Percentiles and Quartiles</h2>
        <p className="text-slate-300 text-lg mb-6">
          Percentiles tell you what percentage of data falls <em>below</em> a specific value. Quartiles are specific percentiles that divide the dataset into four equal parts (25%, 50%, 75%).
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          
          <div className="flex flex-col gap-6">
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
               <h4 className="font-bold text-white mb-4 border-b border-slate-700 pb-2">The Three Quartiles</h4>
               <ul className="space-y-4 text-sm text-slate-300">
                 <li><strong className="text-blue-400">First Quartile (Q1):</strong> The 25th percentile. 25% of data is below this.</li>
                 <li><strong className="text-emerald-400">Second Quartile (Q2):</strong> The 50th percentile. This is identical to the <strong>Median</strong>.</li>
                 <li><strong className="text-purple-400">Third Quartile (Q3):</strong> The 75th percentile. 75% of data is below this.</li>
               </ul>
             </div>

             <HighlightBox icon={Maximize2} title="The Interquartile Range (IQR)" color="emerald">
               <p className="text-[15px] mb-4">
                 The IQR measures the spread of the <strong>middle 50%</strong> of the data. It is highly robust against extreme outliers.
               </p>
               <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 text-center font-serif text-lg text-emerald-400 shadow-inner">
                 IQR = Q3 − Q1
               </div>
             </HighlightBox>
          </div>

          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700 shadow-xl flex flex-col min-h-[350px]">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">Visualizing Quartiles</h3>
             <p className="text-xs text-slate-500 px-2 mb-4">Example Response Times (ms)</p>
             
             <div className="w-full h-full min-h-[250px] relative">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={quartileData} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis type="number" dataKey="x" stroke="#94a3b8" domain={[100, 320]} />
                    <YAxis hide domain={[0, 7]} />
                    
                    {/* Fill Area representing the distribution */}
                    <Area type="monotone" dataKey="y" fill="#64748b" stroke="none" opacity={0.4} />

                    {/* Quartile Lines */}
                    <ReferenceLine x={158.75} stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" label={{ position: 'top', value: 'Q1 (158.7)', fill: '#3b82f6', fontSize: 12, fontWeight: 'bold' }} />
                    <ReferenceLine x={185} stroke="#10b981" strokeWidth={3} label={{ position: 'top', value: 'Median (185)', fill: '#10b981', fontSize: 12, fontWeight: 'bold' }} />
                    <ReferenceLine x={235} stroke="#a855f7" strokeWidth={2} strokeDasharray="4 4" label={{ position: 'top', value: 'Q3 (235.0)', fill: '#a855f7', fontSize: 12, fontWeight: 'bold' }} />

                    {/* IQR Marker */}
                    <ReferenceLine segment={[{x: 158.75, y: 1}, {x: 235, y: 1}]} stroke="#e2e8f0" strokeWidth={3} />
                    <ReferenceDot x={196} y={0.5} r={0} fill="none" label={{ position: 'center', value: 'IQR (Middle 50%)', fill: '#e2e8f0', fontSize: 12 }} />
                  </ComposedChart>
               </ResponsiveContainer>
             </div>
          </div>

        </div>
      </div>
    </SlideFrame>
  );
};

const SlideBoxPlots = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Visualizing Summaries: Box Plots</h2>
      <p className="text-slate-300 text-lg mb-6">
        Box plots (box-and-whisker plots) provide a compact visual summary based on the five-number summary: minimum, Q1, median, Q3, and maximum. They are perfect for identifying outliers and comparing distributions.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
        
        <div className="flex flex-col gap-6">
           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
             <h4 className="font-bold text-white mb-4 border-b border-slate-700 pb-2 flex items-center gap-2"><BoxSelect className="w-5 h-5 text-blue-400"/> Anatomy of a Box Plot</h4>
             <ul className="space-y-3 text-sm text-slate-300">
               <li><strong className="text-blue-400">The Box:</strong> Represents the IQR (middle 50%). Bottom edge is Q1, top edge is Q3.</li>
               <li><strong className="text-emerald-400">Median Line:</strong> The line inside the box. Its position indicates skewness.</li>
               <li><strong className="text-slate-200">The Whiskers:</strong> Extend to the lowest/highest data points still within <MathExpr>1.5 \times IQR</MathExpr> of the box.</li>
               <li><strong className="text-rose-400">Outliers:</strong> Data points falling outside the whiskers are plotted as individual dots.</li>
             </ul>
           </div>

           <HighlightBox icon={ArrowLeftRight} title="Why use them?" color="purple">
             <p className="text-[14px]">
               Placing box plots side-by-side allows you to instantly compare medians, spreads, and outliers across different categories (e.g., comparing daily temperatures of two different cities).
             </p>
           </HighlightBox>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-center relative min-h-[350px]">
           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center mb-6">Daily Temperature by City</h3>
           
           {/* Custom SVG Box Plot for perfect layout replication */}
           <div className="w-full flex-grow flex items-center justify-center relative">
              <svg viewBox="0 0 500 300" className="w-full h-full max-w-[450px]">
                {/* Y-Axis Grid Lines */}
                <line x1="50" y1="50" x2="450" y2="50" stroke="#334155" strokeDasharray="4 4" />
                <line x1="50" y1="100" x2="450" y2="100" stroke="#334155" strokeDasharray="4 4" />
                <line x1="50" y1="150" x2="450" y2="150" stroke="#334155" strokeDasharray="4 4" />
                <line x1="50" y1="200" x2="450" y2="200" stroke="#334155" strokeDasharray="4 4" />
                <line x1="50" y1="250" x2="450" y2="250" stroke="#334155" /> {/* Baseline */}

                {/* Y-Axis Labels (Temp: 10 to 40) */}
                <text x="40" y="254" fill="#94a3b8" fontSize="12" textAnchor="end">10</text>
                <text x="40" y="204" fill="#94a3b8" fontSize="12" textAnchor="end">20</text>
                <text x="40" y="154" fill="#94a3b8" fontSize="12" textAnchor="end">30</text>
                <text x="40" y="104" fill="#94a3b8" fontSize="12" textAnchor="end">40</text>
                <text x="15" y="150" fill="#94a3b8" fontSize="12" textAnchor="middle" transform="rotate(-90 15 150)">Temp (°C)</text>

                {/* X-Axis Labels */}
                <text x="150" y="275" fill="#e2e8f0" fontSize="14" textAnchor="middle" fontWeight="bold">City A</text>
                <text x="350" y="275" fill="#e2e8f0" fontSize="14" textAnchor="middle" fontWeight="bold">City B</text>

                {/* --- CITY A (Blue) --- */}
                {/* Whiskers: Min 12 (y=240), Max 28 (y=160). Q1 17 (y=215), Q3 22 (y=190), Med 19 (y=205) */}
                <line x1="150" y1="215" x2="150" y2="240" stroke="#3b82f6" strokeWidth="2" /> {/* Lower whisker line */}
                <line x1="135" y1="240" x2="165" y2="240" stroke="#3b82f6" strokeWidth="2" /> {/* Lower whisker cap */}
                
                <line x1="150" y1="190" x2="150" y2="160" stroke="#3b82f6" strokeWidth="2" /> {/* Upper whisker line */}
                <line x1="135" y1="160" x2="165" y2="160" stroke="#3b82f6" strokeWidth="2" /> {/* Upper whisker cap */}
                
                {/* Box */}
                <rect x="120" y="190" width="60" height="25" fill="#3b82f6" fillOpacity="0.4" stroke="#3b82f6" strokeWidth="2" />
                {/* Median */}
                <line x1="120" y1="205" x2="180" y2="205" stroke="#3b82f6" strokeWidth="3" />
                {/* Outliers: 3 (y=285), 45 (y=75) */}
                <circle cx="150" cy="285" r="3" fill="#f43f5e" />
                <circle cx="150" cy="75" r="3" fill="#f43f5e" />

                {/* --- CITY B (Orange) --- */}
                {/* Whiskers: Min 14 (y=230), Max 37 (y=115). Q1 21 (y=195), Q3 28 (y=160), Med 24 (y=180) */}
                <line x1="350" y1="195" x2="350" y2="230" stroke="#f97316" strokeWidth="2" /> {/* Lower whisker line */}
                <line x1="335" y1="230" x2="365" y2="230" stroke="#f97316" strokeWidth="2" /> {/* Lower whisker cap */}
                
                <line x1="350" y1="160" x2="350" y2="115" stroke="#f97316" strokeWidth="2" /> {/* Upper whisker line */}
                <line x1="335" y1="115" x2="365" y2="115" stroke="#f97316" strokeWidth="2" /> {/* Upper whisker cap */}
                
                {/* Box */}
                <rect x="320" y="160" width="60" height="35" fill="#f97316" fillOpacity="0.4" stroke="#f97316" strokeWidth="2" />
                {/* Median */}
                <line x1="320" y1="180" x2="380" y2="180" stroke="#f97316" strokeWidth="3" />
              </svg>
           </div>
           
           <p className="text-[11px] text-slate-500 text-center mt-2 italic">
             City B has a higher median and a much wider spread (taller box & whiskers). City A is tighter but contains extreme outliers (red dots).
           </p>
        </div>

      </div>
    </div>
  </SlideFrame>
);


const Slideshow = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((p) => Math.min(p + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlide((p) => Math.max(p - 1, 0));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  return (
    <div className="flex flex-col grow shrink-0 w-full min-h-full bg-[#111111]">
      
      {/* Content Area */}
      <div className="flex flex-col grow w-full">
        {React.createElement(slides[currentSlide].component)}
      </div>

      {/* Navigation Footer (Sticky) */}
      <div className="sticky bottom-0 w-full shrink-0 bg-[#111111] border-t border-slate-800 p-4 md:px-8 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.8)] z-50">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex gap-2.5 flex-wrap justify-center px-4">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-10 bg-blue-500' : 'w-2.5 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default function IntroToStats7() {
  const slides = [
    { component: SlideMean, title: 'The Mean' },
    { component: SlideMedianMode, title: 'Median & Mode' },
    { component: SlideSensitivity, title: 'Sensitivity to Outliers' },
    { component: SlideComparison, title: 'Quick Comparison' },
    { component: SlideSpreadRange, title: 'Measuring Spread: Range' },
    { component: SlideRangeLimitations, title: 'Limitations of Range' },
    { component: SlideVariance, title: 'Variance' },
    { component: SlideStandardDeviation, title: 'Standard Deviation' },
    { component: SlidePercentilesQuartiles, title: 'Percentiles & Quartiles' },
    { component: SlideBoxPlots, title: 'Box Plots' },
  ];

  return <Slideshow slides={slides} />;
}