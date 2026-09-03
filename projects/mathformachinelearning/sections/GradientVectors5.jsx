import React, { useState, useEffect, useRef } from 'react';
import { 
  Info,
  TrendingUp,
  Activity,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Map,
  Target,
  Compass,
  Crosshair,
  Layers,
  MoveUpRight,
  ArrowDownToLine,
  Zap,
  Mountain,
  MapPin
} from 'lucide-react';

export const meta = {
  title: '5. The Gradient Vector',
  subtitle: 'Combining Partial Derivatives',
};

const MathExpr = ({ children }) => (
  <span className="font-serif italic text-blue-300 mx-1 text-[1.05em]">
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

const SlideFrame = ({ children }) => (
  <div className="flex flex-col w-full flex-grow px-6 py-8 md:px-12 md:py-10 bg-[#111111] text-slate-200 selection:bg-blue-500/30">
    <div className="w-full max-w-5xl mx-auto space-y-6 flex flex-col flex-grow">
      {children}
    </div>
  </div>
);

const SlideIntro = () => (
  <SlideFrame>
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Gradient Vector</h2>
      <p className="text-slate-300 text-lg leading-relaxed mb-4">
        Partial derivatives provide the means to understand how functions with multiple inputs, like <MathExpr>f(x, y)</MathExpr>, change along specific axes.
      </p>
      
      <p className="text-slate-300 text-lg leading-relaxed mb-6">
        But what if we want a <strong>single object</strong> that captures the rate of change with respect to <em>all</em> input variables simultaneously? That's where the <strong>gradient vector</strong> comes in.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 left-4 text-slate-700"><Compass className="w-24 h-24 opacity-20" /></div>
          <h3 className="text-xl font-bold text-blue-400 mb-6 z-10">The Nabla Symbol</h3>
          <div className="text-8xl font-serif text-white z-10 mb-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            ∇
          </div>
          <p className="text-slate-300 text-center z-10">
            We denote the gradient using the "nabla" symbol. For a function <MathExpr>f(x, y)</MathExpr>, it is written as <MathExpr>\nabla f</MathExpr> or <MathExpr>\nabla f(x, y)</MathExpr>.
          </p>
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl flex flex-col justify-center">
          <h3 className="text-xl font-bold text-emerald-400 mb-6 text-center">Vector Formulation</h3>
          <p className="text-slate-300 text-sm mb-6 text-center">
            The gradient packages up all the first-order partial derivatives into one convenient column vector.
          </p>
          
          <div className="flex justify-center items-center text-2xl md:text-3xl font-serif text-white">
            <span className="mr-4 text-blue-300">∇f(x, y) =</span>
            
            {/* Matrix Brackets */}
            <div className="flex items-center">
              <div className="w-3 h-24 border-t-2 border-b-2 border-l-2 border-white"></div>
              <div className="flex flex-col gap-6 px-4">
                <div className="flex flex-col items-center">
                  <span className="border-b border-white px-1 pb-1">∂f</span>
                  <span className="pt-1">∂x</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="border-b border-white px-1 pb-1">∂f</span>
                  <span className="pt-1">∂y</span>
                </div>
              </div>
              <div className="w-3 h-24 border-t-2 border-b-2 border-r-2 border-white"></div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-slate-400 text-sm text-center">
        *If the function has <MathExpr>n</MathExpr> inputs, its gradient is an <MathExpr>n</MathExpr>-dimensional vector. Sometimes it is also written horizontally using angle brackets: <MathExpr>⟨\partial f/\partial x, \partial f/\partial y⟩</MathExpr>.
      </p>
    </div>
  </SlideFrame>
);

const SlideCalculating = () => {
  const [step, setStep] = useState(0);

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Example: Calculating a Gradient</h2>
            <p className="text-slate-300 text-lg">Let's calculate the gradient for the function <MathExpr>f(x, y) = x^2 + 5xy</MathExpr>.</p>
          </div>
          <button 
            onClick={() => setStep((s) => (s + 1) % 4)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-md transition-all text-sm shrink-0"
          >
            {step === 3 ? "Reset" : "Next Step"}
          </button>
        </div>

        <div className="flex-grow space-y-6">
          
          {/* Step 1: Partial w.r.t x */}
          <div className={`bg-slate-900 p-6 rounded-xl border transition-all duration-500 ${step >= 1 ? 'border-blue-500/50 shadow-md opacity-100' : 'border-slate-800 opacity-30 grayscale'}`}>
            <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-900/50 flex items-center justify-center text-xs">1</span>
              Find Partial w.r.t x
            </h4>
            <div className="text-slate-300 text-sm mb-4">Treat <MathExpr>y</MathExpr> as a constant. The derivative of <MathExpr>x^2</MathExpr> is <MathExpr>2x</MathExpr>. For <MathExpr>5xy</MathExpr>, <MathExpr>5y</MathExpr> acts as a constant coefficient for <MathExpr>x</MathExpr>, so its derivative is <MathExpr>5y</MathExpr>.</div>
            <div className="flex justify-center text-2xl font-serif text-white bg-slate-800 py-3 rounded-lg border border-slate-700">
               <span className="inline-flex flex-col items-center mr-4"><span className="border-b border-white px-1">∂f</span><span>∂x</span></span>
               = 2x + 5y
            </div>
          </div>

          {/* Step 2: Partial w.r.t y */}
          <div className={`bg-slate-900 p-6 rounded-xl border transition-all duration-500 delay-100 ${step >= 2 ? 'border-emerald-500/50 shadow-md opacity-100' : 'border-slate-800 opacity-30 grayscale'}`}>
            <h4 className="font-bold text-emerald-400 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-900/50 flex items-center justify-center text-xs">2</span>
              Find Partial w.r.t y
            </h4>
            <div className="text-slate-300 text-sm mb-4">Treat <MathExpr>x</MathExpr> as a constant. The derivative of the constant <MathExpr>x^2</MathExpr> is <MathExpr>0</MathExpr>. For <MathExpr>5xy</MathExpr>, <MathExpr>5x</MathExpr> acts as a constant coefficient for <MathExpr>y</MathExpr>, so its derivative is <MathExpr>5x</MathExpr>.</div>
            <div className="flex justify-center text-2xl font-serif text-white bg-slate-800 py-3 rounded-lg border border-slate-700">
               <span className="inline-flex flex-col items-center mr-4"><span className="border-b border-white px-1">∂f</span><span>∂y</span></span>
               = 0 + 5x = 5x
            </div>
          </div>

          {/* Step 3: Assemble */}
          <div className={`bg-slate-800 p-6 rounded-xl border-2 transition-all duration-500 delay-200 ${step >= 3 ? 'border-purple-500 shadow-xl opacity-100 scale-100' : 'border-slate-700 opacity-0 scale-95 pointer-events-none'}`}>
            <h4 className="font-bold text-purple-400 mb-4 text-center text-lg">Assemble the Gradient Vector</h4>
            
            <div className="flex justify-center items-center text-3xl font-serif text-white">
              <span className="mr-4 text-purple-300">∇f(x, y) =</span>
              
              <div className="flex items-center text-blue-300 mr-6">
                <div className="w-2 h-20 border-t-2 border-b-2 border-l-2 border-blue-400"></div>
                <div className="flex flex-col gap-4 px-3">
                  <div className="flex flex-col items-center text-lg"><span className="border-b border-blue-400 px-1 pb-1">∂f</span><span>∂x</span></div>
                  <div className="flex flex-col items-center text-lg"><span className="border-b border-blue-400 px-1 pb-1">∂f</span><span>∂y</span></div>
                </div>
                <div className="w-2 h-20 border-t-2 border-b-2 border-r-2 border-blue-400"></div>
              </div>

              <span className="mr-6 text-slate-500">=</span>

              <div className="flex items-center text-white">
                <div className="w-3 h-20 border-t-2 border-b-2 border-l-2 border-white"></div>
                <div className="flex flex-col gap-4 px-4 text-xl">
                  <div className="text-blue-400 font-bold">2x + 5y</div>
                  <div className="text-emerald-400 font-bold text-center">5x</div>
                </div>
                <div className="w-3 h-20 border-t-2 border-b-2 border-r-2 border-white"></div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </SlideFrame>
  );
};

const SlideEvaluating = () => {
  const [valX, setValX] = useState(1);
  const [valY, setValY] = useState(2);

  const dx = 2 * valX + 5 * valY;
  const dy = 5 * valX;

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
        <h2 className="text-3xl font-bold text-white mb-4">Evaluating at a Point</h2>
        <p className="text-slate-300 text-lg mb-8 leading-relaxed">
          The gradient <MathExpr>\nabla f(x, y)</MathExpr> is itself a function that takes a point <MathExpr>(x, y)</MathExpr> as input and outputs a specific vector. This vector holds the rate of change information for that specific location.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
          
          {/* Controls */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-xl flex flex-col justify-center">
            <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-rose-500" /> Choose Point (x, y)
            </h3>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <label className="text-slate-400 uppercase tracking-widest">X-Coordinate</label>
                  <span className="text-blue-400 font-mono text-xl">{valX}</span>
                </div>
                <input 
                  type="range" min="-5" max="5" step="1" 
                  value={valX} onChange={(e) => setValX(parseInt(e.target.value))} 
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <label className="text-slate-400 uppercase tracking-widest">Y-Coordinate</label>
                  <span className="text-emerald-400 font-mono text-xl">{valY}</span>
                </div>
                <input 
                  type="range" min="-5" max="5" step="1" 
                  value={valY} onChange={(e) => setValY(parseInt(e.target.value))} 
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Result Output */}
          <div className="bg-slate-800 rounded-2xl border-2 border-slate-600 p-8 shadow-2xl flex flex-col justify-center items-center">
             <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-700 pb-2 w-full text-center">
               Resulting Vector
             </div>

             <div className="flex items-center text-3xl font-serif text-white overflow-x-auto w-full justify-center py-4">
                <span className="mr-4 shrink-0">∇f({valX}, {valY}) =</span>
                
                {/* Substitution Matrix */}
                <div className="flex items-center shrink-0">
                  <div className="w-3 h-24 border-t-2 border-b-2 border-l-2 border-slate-500"></div>
                  <div className="flex flex-col gap-4 px-3 text-lg font-mono">
                    <div className="text-slate-300">2({valX}) + 5({valY})</div>
                    <div className="text-slate-300 text-center">5({valX})</div>
                  </div>
                  <div className="w-3 h-24 border-t-2 border-b-2 border-r-2 border-slate-500"></div>
                </div>

                <span className="mx-4 text-slate-500 shrink-0">=</span>

                {/* Final Matrix */}
                <div className="flex items-center shrink-0">
                  <div className="w-3 h-24 border-t-2 border-b-2 border-l-2 border-white"></div>
                  <div className="flex flex-col gap-4 px-4 text-2xl font-bold font-mono">
                    <div className={dx >= 0 ? "text-emerald-400" : "text-rose-400"}>{dx}</div>
                    <div className={`text-center ${dy >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{dy}</div>
                  </div>
                  <div className="w-3 h-24 border-t-2 border-b-2 border-r-2 border-white"></div>
                </div>
             </div>

             <p className="mt-8 text-sm text-slate-300 text-center bg-slate-900/50 p-4 rounded-lg border border-slate-700">
               At the point ({valX}, {valY}), moving purely in the X direction causes a slope of <strong>{dx}</strong>, and moving purely in the Y direction causes a slope of <strong>{dy}</strong>. The gradient packages these together.
             </p>
          </div>

        </div>
      </div>
    </SlideFrame>
  );
};

const SlideGeometric = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Geometric Meaning of the Gradient</h2>
      <p className="text-slate-300 text-lg mb-8">
        The gradient isn't just a convenient way to list partial derivatives; it has a powerful geometric interpretation that's fundamental to optimization in machine learning.
      </p>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <MoveUpRight className="w-64 h-64 text-emerald-500" />
        </div>

        <h3 className="text-2xl font-bold text-emerald-400 mb-6 relative z-10 flex items-center gap-3">
          <TrendingUp className="w-8 h-8" /> The Gradient Points Uphill
        </h3>
        
        <p className="text-slate-200 text-lg leading-relaxed mb-6 relative z-10">
          Imagine you're standing on a hillside. The terrain represents a cost function, where your latitude/longitude are the inputs <MathExpr>x</MathExpr> and <MathExpr>y</MathExpr>, and your altitude is the output <MathExpr>f(x, y)</MathExpr>.
        </p>

        <HighlightBox icon={Compass} title="The Compass of Steepest Ascent" color="emerald">
          <p className="text-lg">
            At any point where you stand, there are many directions you could step. Some go uphill, some go downhill, and some keep you at the same altitude. 
            <br/><br/>
            <strong>The gradient vector <MathExpr>\nabla f</MathExpr> at your current position points directly in the direction of the steepest uphill path.</strong> If you want to climb the hill as quickly as possible, you should walk in the direction indicated by the gradient.
          </p>
        </HighlightBox>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 relative z-10">
          <div className="bg-slate-800 p-5 rounded-xl border-l-4 border-blue-500 shadow-md">
             <div className="text-xl font-serif text-blue-300 mb-2"><span className="border-b border-blue-300 px-1 pb-1">∂f</span><span>∂x</span></div>
             <p className="text-sm text-slate-400">Tells you how quickly altitude changes if you step purely East/West.</p>
          </div>
          <div className="bg-slate-800 p-5 rounded-xl border-l-4 border-purple-500 shadow-md">
             <div className="text-xl font-serif text-purple-300 mb-2"><span className="border-b border-purple-300 px-1 pb-1">∂f</span><span>∂y</span></div>
             <p className="text-sm text-slate-400">Tells you how quickly altitude changes if you step purely North/South.</p>
          </div>
        </div>
      </div>
    </div>
  </SlideFrame>
);

const SlideUnderstandingContours = () => {
  const [altitude, setAltitude] = useState(4); // 1, 4, 9, 16

  // Mapping altitude to radius (r = sqrt(altitude))
  // We use scaled values for SVG rendering
  const radius = Math.sqrt(altitude) * 30; 
  
  // Heights for 3D fake mapping
  const heightMap = {
    16: 40,
    9: 80,
    4: 120,
    1: 160
  };

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">What is a Contour Plot?</h2>
        <p className="text-slate-300 text-lg mb-6 leading-relaxed">
          Before we visualize the gradient, we need to understand <strong>Contour Plots</strong>. A contour plot takes a 3D mountain and squashes it into a 2D map. 
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          
          {/* Interactive Visualizer */}
          <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-xl p-6 flex flex-col relative">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Altitude (Z) Slicer</span>
              <div className="flex gap-2">
                {[16, 9, 4, 1].map(z => (
                  <button 
                    key={z} 
                    onClick={() => setAltitude(z)}
                    className={`w-8 h-8 rounded font-mono font-bold transition-all ${altitude === z ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-grow flex flex-col justify-around gap-6">
              
              {/* 3D Side View */}
              <div className="flex-1 bg-slate-800/50 rounded-xl relative flex items-center justify-center border border-slate-700 overflow-hidden">
                 <span className="absolute top-2 left-3 text-xs font-bold text-slate-500">3D Side View (Mountain)</span>
                 
                 <svg viewBox="0 0 300 200" className="w-full h-full max-w-[250px] relative z-10 mt-6">
                   {/* Draw ellipses from bottom to top to fake 3D */}
                   <ellipse cx="150" cy="180" rx="130" ry="40" fill="#1e293b" />
                   
                   {[16, 9, 4, 1].map(z => {
                     const r = Math.sqrt(z) * 30;
                     const cy = heightMap[z];
                     const isSelected = altitude === z;
                     
                     return (
                       <g key={`3d-${z}`}>
                         {/* Connecting lines to form the bowl shape */}
                         {z !== 16 && <path d={`M ${150 - r} ${cy} Q 150 ${cy + r/2} ${150 + r} ${cy} L ${150 + Math.sqrt(z+7)*30} ${heightMap[z+7] || cy} Q 150 ${(heightMap[z+7] || cy) + (Math.sqrt(z+7)*30)/2} ${150 - Math.sqrt(z+7)*30} ${heightMap[z+7] || cy} Z`} fill="#334155" opacity="0.3" />}
                         
                         {/* The horizontal slice */}
                         <ellipse 
                           cx="150" cy={cy} rx={r} ry={r/2} 
                           fill={isSelected ? "rgba(59, 130, 246, 0.2)" : "none"} 
                           stroke={isSelected ? "#3b82f6" : "#475569"} 
                           strokeWidth={isSelected ? "3" : "1"} 
                         />
                         
                         {isSelected && (
                           <g className="animate-in fade-in duration-300">
                             <line x1="0" y1={cy} x2="300" y2={cy} stroke="#3b82f6" strokeDasharray="4 4" opacity="0.5" />
                             <text x="10" y={cy - 5} fill="#60a5fa" fontSize="12" fontWeight="bold">z = {z}</text>
                           </g>
                         )}
                       </g>
                     )
                   })}
                 </svg>
              </div>

              {/* 2D Top View */}
              <div className="flex-1 bg-slate-800/50 rounded-xl relative flex items-center justify-center border border-slate-700 overflow-hidden">
                 <span className="absolute top-2 left-3 text-xs font-bold text-slate-500">2D Top-Down View (Contour Map)</span>
                 
                 <svg viewBox="0 0 300 200" className="w-full h-full max-w-[200px] relative z-10">
                    <line x1="150" y1="0" x2="150" y2="200" stroke="#475569" strokeWidth="1" />
                    <line x1="0" y1="100" x2="300" y2="100" stroke="#475569" strokeWidth="1" />

                    {[16, 9, 4, 1].map(z => {
                      const r = Math.sqrt(z) * 20; // scale down for top view
                      const isSelected = altitude === z;
                      return (
                        <circle 
                          key={`2d-${z}`}
                          cx="150" cy="100" r={r}
                          fill="none"
                          stroke={isSelected ? "#3b82f6" : "#475569"} 
                          strokeWidth={isSelected ? "3" : "1"}
                          className="transition-all duration-300"
                        />
                      )
                    })}
                    
                    {/* Crosshair at center (0,0) */}
                    <circle cx="150" cy="100" r="2" fill="#f43f5e" />
                 </svg>
              </div>

            </div>
          </div>

          {/* Explanations */}
          <div className="flex flex-col justify-center space-y-6">
             
             <HighlightBox icon={Mountain} title="1. Slicing the Mountain" color="blue">
               <p className="text-[15px]">
                 Imagine slicing a 3D hill horizontally at specific heights (z=1, z=4, z=9). 
                 The outer edge of each slice forms a ring. If you look straight down from above, you see concentric rings. These are <strong>contour lines</strong>.
               </p>
             </HighlightBox>

             <HighlightBox icon={MapPin} title='2. "Same Function Value"' color="emerald">
               <p className="text-[15px]">
                 When we say a contour line connects points where the "function has the same value," we mean <strong>every point on that ring is at the exact same altitude.</strong> 
                 <br/><br/>
                 If you walk <em>along</em> the blue ring, you never go uphill or downhill. It is a perfectly flat trail wrapping around the mountain.
               </p>
             </HighlightBox>

             <HighlightBox icon={Target} title="3. The 90-Degree Rule" color="purple">
               <p className="text-[15px]">
                 Because walking <em>along</em> the contour line means 0 change in altitude, the direction that gives you the <strong>steepest</strong> change in altitude must be a 90-degree turn! 
                 <br/><br/>
                 Therefore, the steepest path up the mountain is always <strong>perpendicular (orthogonal)</strong> to the flat contour lines.
               </p>
             </HighlightBox>

          </div>

        </div>
      </div>
    </SlideFrame>
  );
};

const SlideVisualizingContour = () => {
  const [point, setPoint] = useState({ x: 1, y: 1 });
  const svgRef = useRef(null);

  // Handle dragging the point around the SVG
  const handlePointerMove = (e) => {
    if (e.buttons !== 1) return; // Only process if mouse button is down
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    
    // Transform screen coordinates to SVG coordinates
    const cursorPt = pt.matrixTransform(svg.getScreenCTM().inverse());
    
    // Convert SVG coordinates to our Math grid (-2.5 to 2.5)
    // SVG width is 400, center is 200.
    const mathX = (cursorPt.x - 200) / 80;
    const mathY = -(cursorPt.y - 200) / 80; // Invert Y

    // Clamp to -2.5 to 2.5
    const clampedX = Math.max(-2.5, Math.min(2.5, mathX));
    const clampedY = Math.max(-2.5, Math.min(2.5, mathY));

    setPoint({ x: clampedX, y: clampedY });
  };

  // Gradient of f(x,y) = x^2 + y^2 is [2x, 2y]
  const gradX = 2 * point.x;
  const gradY = 2 * point.y;

  // Convert point back to SVG coordinates for rendering
  const svgPx = 200 + point.x * 80;
  const svgPy = 200 - point.y * 80;

  // Vector end point (scaled down for visualization)
  const vectorScale = 15;
  const svgGx = svgPx + gradX * vectorScale;
  const svgGy = svgPy - gradY * vectorScale; // - because SVG y is inverted

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Visualizing the Gradient</h2>
        <p className="text-slate-300 text-lg mb-6">
          Now let's see the gradient vector in action on a 2D contour map for <MathExpr>f(x,y) = x^2 + y^2</MathExpr>. Its minimum (valley floor) is at the center (0,0).
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          
          {/* Interactive SVG Contour Plot */}
          <div className="bg-white rounded-2xl shadow-xl p-4 flex flex-col items-center justify-center relative select-none">
             <div className="absolute top-4 left-4 text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/80 p-2 rounded z-10 pointer-events-none border border-slate-200 shadow-sm">
               Drag the red point!
             </div>
             
             <svg 
                ref={svgRef}
                viewBox="0 0 400 400" 
                className="w-full max-w-[400px] h-auto cursor-crosshair touch-none"
                onPointerDown={handlePointerMove}
                onPointerMove={handlePointerMove}
             >
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                  </marker>
                </defs>

                {/* Grid Lines */}
                <line x1="200" y1="0" x2="200" y2="400" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="0" y1="200" x2="400" y2="200" stroke="#cbd5e1" strokeWidth="1" />

                {/* Contour Circles f(x,y) = r^2 -> r = sqrt(val). Max r visualized = 2.5 (200px) */}
                {[0.5, 1, 1.5, 2, 2.5].map((r, i) => (
                  <circle 
                    key={i} cx="200" cy="200" r={r * 80} 
                    fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity={1 - (i*0.15)}
                  />
                ))}

                {/* Labels for Contours */}
                <text x="202" y={200 - 1*80 - 4} fontSize="10" fill="#3b82f6" opacity="0.8">Altitude: 1</text>
                <text x="202" y={200 - 2*80 - 4} fontSize="10" fill="#3b82f6" opacity="0.6">Altitude: 4</text>

                {/* Gradient Vector Line & Arrow */}
                <line 
                  x1={svgPx} y1={svgPy} 
                  x2={svgGx} y2={svgGy} 
                  stroke="#ef4444" strokeWidth="3" 
                  markerEnd="url(#arrowhead)"
                />

                {/* Draggable Point */}
                <circle cx={svgPx} cy={svgPy} r="6" fill="#ef4444" className="hover:scale-150 transition-transform origin-center" />
             </svg>
             <p className="text-xs text-slate-500 mt-2 font-mono">
               Click and drag to explore the vector field.
             </p>
          </div>

          <div className="flex flex-col justify-center space-y-6">
             <HighlightBox icon={Activity} title="Orthogonal to Contours" color="blue">
               <p className="text-[15px]">
                 Drag the point around. Notice how the red gradient arrow is <em>always</em> <strong>perpendicular (orthogonal)</strong> to the blue contour line passing beneath it. It instantly finds the steepest path!
               </p>
             </HighlightBox>

             <HighlightBox icon={MoveUpRight} title="Pointing Away from Minimum" color="rose">
               <p className="text-[15px]">
                 Because the gradient points in the direction of steepest <em>ascent</em> (uphill), it always points <strong>directly away</strong> from the valley floor at (0,0) and towards higher altitudes.
               </p>
             </HighlightBox>

             <div className="bg-slate-900 border border-slate-700 p-5 rounded-xl mt-4 font-mono text-sm text-slate-300 shadow-inner">
               <div>Current Point: <span className="text-white">({point.x.toFixed(2)}, {point.y.toFixed(2)})</span></div>
               <div className="mt-2 text-rose-400">Gradient Vector ∇f:</div>
               <div className="ml-4 font-bold text-white">[ {gradX.toFixed(2)}, {gradY.toFixed(2)} ]</div>
             </div>
          </div>

        </div>
      </div>
    </SlideFrame>
  );
};

const SlideOptimization = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Magnitude and Optimization</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        
        {/* Magnitude Box */}
        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl flex flex-col">
          <h3 className="text-xl font-bold text-blue-400 mb-4 border-b border-slate-700 pb-2">Magnitude of the Gradient</h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            The gradient doesn't just tell us the direction; its <strong>length (magnitude)</strong> tells us <em>how steep</em> that ascent actually is. It is calculated using the Pythagorean theorem:
          </p>

          <div className="flex justify-center items-center text-xl md:text-2xl font-serif text-white bg-slate-900 py-6 rounded-xl border border-slate-800 mb-6 shadow-inner overflow-x-auto whitespace-nowrap px-4">
            <span className="text-blue-300 mr-4">||∇f|| =</span>
            <span>√</span>
            <span className="border-t border-white px-2 pt-1 flex items-center gap-2">
              <span>(<span className="inline-flex flex-col items-center align-middle mx-1"><span className="border-b border-white px-1">∂f</span><span className="text-sm">∂x</span></span>)²</span>
              <span>+</span>
              <span>(<span className="inline-flex flex-col items-center align-middle mx-1"><span className="border-b border-white px-1">∂f</span><span className="text-sm">∂y</span></span>)²</span>
            </span>
          </div>

          <ul className="text-sm text-slate-400 space-y-3 mt-auto list-disc pl-5">
            <li><strong>Long vector:</strong> Very steep part of the hill.</li>
            <li><strong>Short vector:</strong> Relatively flat part.</li>
            <li><strong>Zero length:</strong> At a peak or valley floor (minimum/maximum), the ground is flat. <MathExpr>\nabla f = [0, 0]</MathExpr>.</li>
          </ul>
        </div>

        {/* Optimization Box */}
        <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 p-8 rounded-3xl border border-emerald-800/50 shadow-xl flex flex-col">
          <h3 className="text-xl font-bold text-emerald-400 mb-4 border-b border-emerald-800/50 pb-2 flex items-center gap-2">
            <ArrowDownToLine className="w-6 h-6" /> Connecting to Optimization
          </h3>
          <p className="text-slate-300 text-[15px] leading-relaxed mb-4">
            This geometric meaning is the beating heart of machine learning. ML algorithms minimize a <em>cost function</em> to find the best parameters.
          </p>
          <p className="text-slate-300 text-[15px] leading-relaxed mb-6">
            If the gradient (<MathExpr>\nabla f</MathExpr>) points in the direction of steepest <strong>ascent</strong> (uphill), how do we find the valley floor (minimum)?
          </p>

          <div className="bg-emerald-900/40 border border-emerald-500/50 p-6 rounded-xl mt-auto text-center shadow-lg">
             <div className="text-xl text-white font-bold mb-2">We move in the opposite direction!</div>
             <div className="text-3xl font-serif font-bold text-emerald-400">−∇f</div>
             <p className="text-sm text-emerald-200 mt-4">
               Taking steps in the direction of the <strong>negative gradient</strong> is the core algorithm known as <strong>Gradient Descent</strong>.
             </p>
          </div>
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

export default function GradientVector5() {
  const slides = [
    { component: SlideIntro, title: 'The Gradient Vector' },
    { component: SlideCalculating, title: 'Calculating a Gradient' },
    { component: SlideEvaluating, title: 'Evaluating at a Point' },
    { component: SlideGeometric, title: 'Geometric Meaning' },
    { component: SlideUnderstandingContours, title: 'What is a Contour Plot?' },
    { component: SlideVisualizingContour, title: 'Visualizing the Gradient' },
    { component: SlideOptimization, title: 'Magnitude & Optimization' },
  ];

  return <Slideshow slides={slides} />;
}