import React, { useState, useEffect } from 'react';
import { 
  Info,
  ChevronLeft,
  ChevronRight,
  Dices,
  Coins,
  MousePointerClick,
  Target,
  Layers,
  ArrowRight,
  Plus,
  Minus,
  Maximize,
  CircleOff,
  Activity,
  Eye,
  Table,
  RefreshCw,
  GitMerge,
  Brain,
  FlaskConical,
  Scale,
  AlertTriangle,
  ArrowDown,
  User
} from 'lucide-react';

export const meta = {
  title: '8. Basic Probability Concepts',
  subtitle: 'Events, Sample Spaces, and Set Theory',
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


const SlideIntro = () => (
  <SlideFrame>
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Experiments and Sample Spaces</h2>
      <p className="text-slate-300 text-lg leading-relaxed mb-6">
        Data analysis deals with uncertainty. Probability provides the framework for conceptualizing and quantifying this uncertainty. It all starts with defining what can actually happen.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
           <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2 text-xl border-b border-slate-800 pb-2">
             <Activity className="w-5 h-5"/> Experiments & Outcomes
           </h3>
           <p className="text-slate-300 text-sm mb-4">
             An <strong>experiment</strong> (or trial) is a process with an observable result that cannot be predicted with certainty beforehand. 
           </p>
           <p className="text-slate-300 text-sm">
             An <strong>outcome</strong> is a single, specific, individual result that we can observe from that experiment.
           </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
           <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2 text-xl border-b border-slate-800 pb-2">
             <Layers className="w-5 h-5"/> The Sample Space (S)
           </h3>
           <p className="text-slate-300 text-sm mb-4">
             The <strong>sample space</strong>, denoted by <MathExpr>S</MathExpr>, is the complete set of <em>all possible</em> distinct outcomes. 
           </p>
           <p className="text-slate-300 text-sm">
             It represents the entire universe of what could happen. It must be exhaustive (includes everything) and mutually exclusive (only one outcome can happen at a time).
           </p>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-200 mb-4">Examples of Sample Spaces</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
         <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex flex-col items-center text-center shadow-md">
           <Coins className="w-10 h-10 text-orange-400 mb-3"/>
           <h4 className="font-bold text-white mb-2">Coin Flip</h4>
           <div className="bg-slate-900 px-3 py-2 rounded border border-slate-700 font-serif text-sm w-full mt-auto">
             S = {'{Heads, Tails}'}
           </div>
         </div>
         
         <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex flex-col items-center text-center shadow-md">
           <Dices className="w-10 h-10 text-blue-400 mb-3"/>
           <h4 className="font-bold text-white mb-2">Die Roll</h4>
           <div className="bg-slate-900 px-3 py-2 rounded border border-slate-700 font-serif text-sm w-full mt-auto">
             S = {'{1, 2, 3, 4, 5, 6}'}
           </div>
         </div>

         <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex flex-col items-center text-center shadow-md">
           <MousePointerClick className="w-10 h-10 text-purple-400 mb-3"/>
           <h4 className="font-bold text-white mb-2">Ad Click</h4>
           <div className="bg-slate-900 px-3 py-2 rounded border border-slate-700 font-serif text-sm w-full mt-auto">
             S = {'{Click, No Click}'}
           </div>
         </div>
      </div>
    </div>
  </SlideFrame>
);


const SlideEvents = () => {
  const [activeEvent, setActiveEvent] = useState('none');

  const outcomes = [1, 2, 3, 4, 5, 6];
  
  const events = {
    'none': { name: "No Event Selected", test: () => false, desc: "Click a button below to define an event." },
    'eventA': { name: "Event A: Rolling a 3", test: (x) => x === 3, desc: "A subset containing a single outcome. A = {3}." },
    'eventB': { name: "Event B: Even Number", test: (x) => x % 2 === 0, desc: "Includes multiple outcomes. B = {2, 4, 6}." },
    'eventC': { name: "Event C: Greater than 4", test: (x) => x > 4, desc: "C = {5, 6}." },
    'eventD': { name: "Event D: Rolling a 7", test: (x) => x === 7, desc: "An impossible event! The subset is empty. D = {} or ∅." },
    'eventE': { name: "Event E: Less than 10", test: (x) => x < 10, desc: "A certain event. It includes every outcome. E = S." },
  };

  const currentEvent = events[activeEvent];

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Events: Subsets of the Sample Space</h2>
        <p className="text-slate-300 text-lg mb-6 leading-relaxed">
          Often, we care about a specific collection of outcomes rather than just one. An <strong>event</strong> is simply a <em>subset</em> of the sample space. Let's use the sample space of rolling a standard die: <MathExpr>S = {'{1, 2, 3, 4, 5, 6}'}</MathExpr>.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          
          <div className="flex flex-col gap-4">
             <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Define an Event</h3>
               <div className="flex flex-col gap-2">
                 {Object.keys(events).filter(k => k !== 'none').map(key => (
                   <button 
                     key={key}
                     onClick={() => setActiveEvent(key)}
                     className={`px-4 py-3 rounded-lg font-bold text-left transition-all border ${activeEvent === key ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'}`}
                   >
                     {events[key].name}
                   </button>
                 ))}
               </div>
             </div>
             
             <div className="bg-slate-900 p-5 rounded-xl border border-blue-500/30 text-blue-100 shadow-inner flex-grow">
               <h4 className="font-bold text-blue-400 mb-2">Event Description:</h4>
               <p className="text-sm">{currentEvent.desc}</p>
             </div>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
             <h3 className="absolute top-4 left-4 text-xs font-bold text-slate-500 uppercase tracking-widest z-10">The Universe (Sample Space S)</h3>
             
             <div className="grid grid-cols-3 gap-6 relative z-10 mt-6 w-full max-w-[300px]">
               {outcomes.map(num => {
                 const isIncluded = currentEvent.test(num);
                 return (
                   <div 
                     key={num} 
                     className={`aspect-square flex items-center justify-center rounded-2xl text-3xl font-bold font-serif transition-all duration-500 border-2 ${
                       isIncluded 
                       ? 'bg-blue-500 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] scale-110' 
                       : 'bg-slate-800 border-slate-700 text-slate-500 scale-95 opacity-50'
                     }`}
                   >
                     {num}
                   </div>
                 )
               })}
             </div>

             {activeEvent === 'eventD' && (
               <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-20 animate-in fade-in">
                 <div className="flex flex-col items-center">
                   <CircleOff className="w-16 h-16 text-rose-500 mb-2" />
                   <span className="font-bold text-rose-400 text-xl">Empty Set (∅)</span>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};


const SlideCalculation = () => {
  const [eventFilter, setEventFilter] = useState('even');

  const outcomes = [1, 2, 3, 4, 5, 6];
  
  const filters = {
    'even': { name: "Rolling an Even Number", test: (x) => x % 2 === 0 },
    'gt4': { name: "Rolling > 4", test: (x) => x > 4 },
    'tails': { name: "Flipping Heads", test: (x) => x === 'H', space: ['H', 'T'] } // Just to show adaptability, though we'll focus on dice visually
  };

  const space = filters[eventFilter].space || outcomes;
  const favorableOutcomes = space.filter(filters[eventFilter].test);
  
  const numFavorable = favorableOutcomes.length;
  const numTotal = space.length;
  const prob = (numFavorable / numTotal).toFixed(2);

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Calculating Simple Probabilities</h2>
        <p className="text-slate-300 text-lg mb-6">
          When we assume that all individual outcomes in the sample space are <strong>equally likely</strong> (like a fair die or coin), calculating the probability of an event <MathExpr>E</MathExpr> is a matter of simple counting.
        </p>

        <div className="bg-slate-900 py-8 px-6 rounded-2xl border border-slate-800 shadow-xl flex justify-center mb-8">
           <div className="flex items-center text-xl md:text-3xl font-serif text-white">
              <span className="text-blue-400 mr-4">P(E) =</span>
              <div className="flex flex-col items-center">
                <span className="border-b border-white px-4 pb-2">Number of favorable outcomes</span>
                <span className="pt-2">Total possible outcomes</span>
              </div>
              <span className="mx-6 text-slate-500">=</span>
              <div className="flex flex-col items-center text-emerald-400">
                <span className="border-b border-emerald-500/50 px-3 pb-1">|E|</span>
                <span className="pt-1">|S|</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
             <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
               <h3 className="font-bold text-slate-200">Try it out:</h3>
               <select 
                 value={eventFilter} 
                 onChange={(e) => setEventFilter(e.target.value)}
                 className="bg-slate-900 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500"
               >
                 <option value="even">Event: Even Number</option>
                 <option value="gt4">Event: Greater than 4</option>
                 <option value="tails">Event: Flipping Heads (Coin)</option>
               </select>
             </div>

             <ul className="space-y-4 text-slate-300 font-mono text-sm">
               <li>
                 1. Identify Sample Space S:<br/>
                 <span className="text-white mt-1 block">S = {'{'} {space.join(', ')} {'}'} &rarr; <span className="text-slate-400">|S| = {numTotal}</span></span>
               </li>
               <li>
                 2. Define Event E:<br/>
                 <span className="text-emerald-400 mt-1 block">E = {'{'} {favorableOutcomes.join(', ')} {'}'} &rarr; <span className="text-emerald-400 font-bold">|E| = {numFavorable}</span></span>
               </li>
               <li className="pt-4 border-t border-slate-700">
                 3. Calculate P(E):<br/>
                 <div className="flex items-center text-2xl text-white mt-3">
                    <span className="mr-3 text-blue-400">P(E) =</span>
                    <div className="flex flex-col items-center">
                      <span className="border-b border-slate-500 px-2 pb-1 text-emerald-400">{numFavorable}</span>
                      <span className="pt-1 text-slate-400">{numTotal}</span>
                    </div>
                    <span className="ml-4 font-bold text-blue-300">= {prob}</span>
                 </div>
               </li>
             </ul>
          </div>

          <div className="flex flex-col gap-6 justify-center">
             <HighlightBox icon={Target} title="The 'Equally Likely' Rule" color="orange">
                <p className="text-[15px]">
                  This simple counting formula relies <em>heavily</em> on the assumption that all outcomes are equally likely. If you have a weighted die or a trick coin, this method fails, and you must use different approaches!
                </p>
             </HighlightBox>

             <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-inner">
               <h4 className="font-bold text-white mb-2">Properties of Probabilities</h4>
               <p className="text-sm text-slate-300 mb-3">Because <MathExpr>|E|</MathExpr> can never be negative, and can never be larger than <MathExpr>|S|</MathExpr>, probabilities are strictly bounded:</p>
               <div className="text-center font-serif text-2xl text-emerald-400 font-bold bg-slate-800 py-3 rounded-lg border border-slate-600">
                 0 ≤ P(E) ≤ 1
               </div>
               <div className="flex justify-between text-xs text-slate-500 mt-2 px-4">
                 <span>0 = Impossible</span>
                 <span>1 = Certain</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};


const SlideComplement = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Set Theory: The Complement</h2>
      <p className="text-slate-300 text-lg mb-6 leading-relaxed">
        Set theory gives us a precise language to manipulate events. The most basic operation is the <strong>Complement</strong>. The complement of an event <MathExpr>A</MathExpr>, written as <MathExpr>A^c</MathExpr> or <MathExpr>\bar{'{A}'}</MathExpr>, is everything in the sample space that is <em>not</em> in <MathExpr>A</MathExpr>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        
        <div className="flex flex-col justify-center space-y-6">
           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
             <h4 className="font-bold text-blue-400 mb-2 border-b border-slate-700 pb-2">Example: Rolling a Die</h4>
             <ul className="space-y-3 text-sm text-slate-300 font-mono">
               <li><span className="text-slate-400">Sample Space:</span> S = {'{1, 2, 3, 4, 5, 6}'}</li>
               <li><span className="text-blue-400">Event A (Even):</span> A = {'{2, 4, 6}'}</li>
               <li><span className="text-rose-400">Complement (Not Even):</span> A<sup className="text-[10px]">c</sup> = {'{1, 3, 5}'}</li>
             </ul>
           </div>

           <HighlightBox icon={Minus} title="The Complement Rule" color="rose">
             <p className="text-[15px] mb-4">
               Since an event must either happen or not happen, their probabilities must sum to 1 (100%).
             </p>
             <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 text-center font-serif text-lg text-rose-400 shadow-inner">
               P(A) + P(A<sup className="text-xs">c</sup>) = 1  &rarr;  P(A<sup className="text-xs">c</sup>) = 1 - P(A)
             </div>
           </HighlightBox>
           <p className="text-sm text-slate-400 italic">
             This is incredibly useful! Sometimes it's much easier to calculate the probability that something <em>doesn't</em> happen, and subtract it from 1.
           </p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col items-center justify-center relative min-h-[350px]">
           <h3 className="absolute top-4 left-4 text-xs font-bold text-slate-500 uppercase tracking-widest z-10">Venn Diagram</h3>
           
           {/* SVG Venn Diagram for Complement */}
           <div className="w-full flex-grow flex items-center justify-center relative mt-6">
              <svg viewBox="0 0 300 300" className="w-full max-w-[280px] h-auto">
                {/* The Box (Sample Space) */}
                <rect x="10" y="10" width="280" height="280" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
                <text x="15" y="25" fill="#cbd5e1" fontSize="12" fontWeight="bold">S (Sample Space)</text>
                
                {/* Shaded Area (Complement) */}
                <path d="M 10 10 H 290 V 290 H 10 Z M 150 150 m -70, 0 a 70,70 0 1,0 140,0 a 70,70 0 1,0 -140,0 Z" fill="#f43f5e" fillOpacity="0.2" fillRule="evenodd" />

                {/* The Circle (Event A) */}
                <circle cx="150" cy="150" r="70" fill="#3b82f6" stroke="#2563eb" strokeWidth="3" />
                <text x="150" y="155" fill="#ffffff" fontSize="24" textAnchor="middle" fontWeight="bold">A</text>
                
                <text x="50" y="60" fill="#f43f5e" fontSize="14" fontWeight="bold">A<tspan dy="-5" fontSize="10">c</tspan> (Not A)</text>
              </svg>
           </div>
           
           <p className="text-[12px] text-slate-400 text-center mt-4">
             The entire box is S. The circle is A. The red shaded area outside the circle represents the complement <MathExpr>A^c</MathExpr>.
           </p>
        </div>

      </div>
    </div>
  </SlideFrame>
);


const SlideIntersectionUnion = () => {
  const [view, setView] = useState('intersection');

  return (
    <SlideFrame>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <div className="flex justify-between items-end mb-6 shrink-0">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Combining Events</h2>
            <p className="text-slate-300 text-lg">
              What happens when we analyze two events simultaneously? We use Intersections (AND) and Unions (OR).
            </p>
          </div>
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
             <button onClick={()=>setView('intersection')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${view === 'intersection' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Intersection (AND)</button>
             <button onClick={()=>setView('union')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${view === 'union' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>Union (OR)</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          
          <div className="flex flex-col gap-6">
             {view === 'intersection' ? (
                <div className="animate-in slide-in-from-left-4 duration-500 space-y-6">
                  <div className="bg-slate-800 p-6 rounded-xl border border-blue-500/50 shadow-md">
                    <h3 className="font-bold text-blue-400 text-xl mb-2 flex items-center gap-2">The Intersection (<MathExpr>\cap</MathExpr>)</h3>
                    <p className="text-slate-300 mb-4">
                      The intersection of events A and B, written <MathExpr>A \cap B</MathExpr>, represents outcomes that are in <strong>both</strong> A <em>and</em> B at the same time. It's the overlap.
                    </p>
                    <div className="bg-slate-900 p-3 rounded font-mono text-sm text-slate-300">
                      A = Even = {'{2, 4, 6}'}<br/>
                      B = &gt;3 = {'{4, 5, 6}'}<br/>
                      <span className="text-blue-400 font-bold mt-2 block border-t border-slate-700 pt-2">A ∩ B = {'{4, 6}'}</span>
                    </div>
                  </div>
                </div>
             ) : (
                <div className="animate-in slide-in-from-right-4 duration-500 space-y-6">
                  <div className="bg-slate-800 p-6 rounded-xl border border-emerald-500/50 shadow-md">
                    <h3 className="font-bold text-emerald-400 text-xl mb-2 flex items-center gap-2">The Union (<MathExpr>\cup</MathExpr>)</h3>
                    <p className="text-slate-300 mb-4">
                      The union of events A and B, written <MathExpr>A \cup B</MathExpr>, represents outcomes that are in A, <em>or</em> in B, <em>or</em> in both. It combines the sets.
                    </p>
                    <div className="bg-slate-900 p-3 rounded font-mono text-sm text-slate-300">
                      A = Even = {'{2, 4, 6}'}<br/>
                      B = &gt;3 = {'{4, 5, 6}'}<br/>
                      <span className="text-emerald-400 font-bold mt-2 block border-t border-slate-700 pt-2">A ∪ B = {'{2, 4, 5, 6}'}</span>
                    </div>
                  </div>
                </div>
             )}
             
             <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 shadow-inner">
               <h4 className="font-bold text-white text-sm mb-2">Memory Trick:</h4>
               <p className="text-sm text-slate-400 mb-2"><MathExpr>\cap</MathExpr> looks like an 'n' for aNd (Intersection).</p>
               <p className="text-sm text-slate-400"><MathExpr>\cup</MathExpr> looks like a 'U' for Union.</p>
             </div>
          </div>

          {/* Interactive Venn Diagram */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col items-center justify-center relative min-h-[350px]">
             
             <div className="w-full flex-grow flex items-center justify-center relative">
                <svg viewBox="0 0 400 300" className="w-full max-w-[380px] h-auto">
                  <defs>
                    <clipPath id="circleA">
                      <circle cx="150" cy="150" r="80" />
                    </clipPath>
                  </defs>

                  {/* Sample Space Box */}
                  <rect x="10" y="10" width="380" height="280" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
                  <text x="15" y="25" fill="#cbd5e1" fontSize="12" fontWeight="bold">S</text>

                  {/* Base Circles (unfilled borders for structure) */}
                  <circle cx="150" cy="150" r="80" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />
                  <circle cx="250" cy="150" r="80" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />

                  {view === 'intersection' && (
                    <g className="animate-in zoom-in duration-500">
                      {/* Only fill the intersection using clipPath */}
                      <circle cx="250" cy="150" r="80" fill="#3b82f6" clipPath="url(#circleA)" />
                      <text x="200" y="155" fill="#ffffff" fontSize="20" textAnchor="middle" fontWeight="bold">A∩B</text>
                    </g>
                  )}

                  {view === 'union' && (
                    <g className="animate-in zoom-in duration-500">
                      {/* Fill both circles for Union */}
                      <circle cx="150" cy="150" r="80" fill="#10b981" fillOpacity="0.7" />
                      <circle cx="250" cy="150" r="80" fill="#10b981" fillOpacity="0.7" />
                      <text x="120" y="155" fill="#ffffff" fontSize="20" textAnchor="middle" fontWeight="bold">A</text>
                      <text x="280" y="155" fill="#ffffff" fontSize="20" textAnchor="middle" fontWeight="bold">B</text>
                    </g>
                  )}

                  <text x="100" y="60" fill="#cbd5e1" fontSize="16" fontWeight="bold">Event A</text>
                  <text x="250" y="60" fill="#cbd5e1" fontSize="16" fontWeight="bold">Event B</text>
                </svg>
             </div>

             <div className="mt-4 text-center">
                {view === 'intersection' 
                  ? <span className="text-blue-400 text-sm font-bold bg-blue-900/30 px-3 py-1 rounded">The highlighted area is only the overlap.</span>
                  : <span className="text-emerald-400 text-sm font-bold bg-emerald-900/30 px-3 py-1 rounded">The highlighted area is everything in A, B, or both.</span>
                }
             </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};


const SlideAdditionRule = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">The Addition Rule</h2>
      <p className="text-slate-300 text-lg mb-8">
        How do we calculate the probability of a union, <MathExpr>P(A \cup B)</MathExpr>? We might be tempted to just add <MathExpr>P(A)</MathExpr> and <MathExpr>P(B)</MathExpr>. Let's see why that doesn't work.
      </p>

      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-700 shadow-2xl flex flex-col items-center justify-center mb-8">
        <h3 className="text-xl font-bold text-rose-400 mb-6 border-b border-slate-700 pb-2 w-full text-center">The Double-Counting Problem</h3>
        
        {/* Visual Equation SVG */}
        <svg viewBox="0 0 600 150" className="w-full max-w-[550px] h-auto">
          {/* P(A) */}
          <circle cx="80" cy="75" r="40" fill="#3b82f6" fillOpacity="0.8" />
          <text x="80" y="135" fill="#94a3b8" fontSize="14" textAnchor="middle">P(A)</text>
          
          <text x="150" y="85" fill="#ffffff" fontSize="30" textAnchor="middle" fontWeight="bold">+</text>

          {/* P(B) */}
          <circle cx="220" cy="75" r="40" fill="#eab308" fillOpacity="0.8" />
          <text x="220" y="135" fill="#94a3b8" fontSize="14" textAnchor="middle">P(B)</text>

          <text x="290" y="85" fill="#ffffff" fontSize="30" textAnchor="middle" fontWeight="bold">=</text>

          {/* Result with Overlap (Double Counted) */}
          <circle cx="360" cy="75" r="40" fill="#3b82f6" fillOpacity="0.8" />
          <circle cx="400" cy="75" r="40" fill="#eab308" fillOpacity="0.8" />
          {/* Highlight intersection artificially */}
          <path d="M 380 40 A 40 40 0 0 0 380 110 A 40 40 0 0 0 380 40" fill="#f43f5e" />
          <text x="380" y="80" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">2x</text>
          
          <text x="380" y="135" fill="#f43f5e" fontSize="14" textAnchor="middle" fontWeight="bold">Intersection counted twice!</text>
        </svg>

        <p className="text-sm text-slate-300 mt-6 max-w-2xl text-center">
          If we just add the probabilities, the outcomes that exist in the intersection <MathExpr>(A \cap B)</MathExpr> are added once when we add A, and added <em>again</em> when we add B.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
         <div className="flex flex-col justify-center">
           <HighlightBox icon={Plus} title="The Formal Addition Rule" color="emerald">
             <p className="text-[15px] mb-4">
               To correct for this, we simply subtract the probability of the intersection once.
             </p>
             <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-center font-serif text-lg md:text-xl text-emerald-400 shadow-inner whitespace-nowrap overflow-x-auto">
               P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
             </div>
           </HighlightBox>
         </div>

         <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md flex flex-col justify-center">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2"><CircleOff className="w-5 h-5 text-slate-400"/> Special Case: Mutually Exclusive</h4>
            <p className="text-sm text-slate-300 mb-4">
              If events A and B cannot happen at the same time (e.g., rolling a 1 and rolling an even number on a single die), they are <strong>mutually exclusive</strong>.
            </p>
            <p className="text-sm text-slate-300 mb-4">
              Their intersection is empty, so <MathExpr>P(A \cap B) = 0</MathExpr>. The formula beautifully simplifies to:
            </p>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-600 text-center font-serif text-lg text-white">
               P(A ∪ B) = P(A) + P(B)
            </div>
         </div>
      </div>
    </div>
  </SlideFrame>
);


const SlideConditionalIntro = () => {
  const [isConditional, setIsConditional] = useState(false);

  return (
    <SlideFrame>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Conditional Probability Explained</h2>
        <p className="text-slate-300 text-lg mb-6 leading-relaxed">
          What happens to our probability estimate if we <em>already know</em> some information? Conditional probability, written as <MathExpr>P(A|B)</MathExpr> ("Probability of A given B"), measures the likelihood of event A occurring, given that event B has already happened.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          <div className="flex flex-col gap-6">
             <HighlightBox icon={Eye} title="Intuition: Reducing the Sample Space" color="blue">
               <p className="text-[15px] mb-4">
                 When we know event B has occurred, all outcomes outside of B are no longer relevant. <strong>Event B becomes our new, reduced sample space.</strong>
               </p>
               <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-center font-serif text-lg text-blue-300 shadow-inner overflow-x-auto whitespace-nowrap">
                 P(A|B) = <span className="inline-flex flex-col items-center align-middle mx-2"><span className="border-b border-blue-400/50 px-2 pb-1">P(A ∩ B)</span><span className="pt-1 text-emerald-400">P(B)</span></span>
               </div>
               <p className="text-[13px] text-slate-400 mt-4 italic text-center">
                 We take the overlap (where both happen) and divide it by the probability of our new universe (B).
               </p>
             </HighlightBox>

             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-slate-200">Interactive Visualizer</h4>
                  <button 
                    onClick={() => setIsConditional(!isConditional)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md ${isConditional ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
                  >
                    {isConditional ? "Reset to P(A)" : "Show P(A | B)"}
                  </button>
                </div>
                <p className="text-sm text-slate-400 min-h-[40px]">
                  {isConditional 
                    ? "Notice how the universe shrinks! Everything outside of B darkens. To find A, we now only look at the intersection inside B." 
                    : "Currently viewing the full Sample Space (S). Both A and B are possible."}
                </p>
             </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col items-center justify-center relative min-h-[350px] overflow-hidden">
             
             <div className="w-full flex-grow flex items-center justify-center relative transition-all duration-1000">
                <svg viewBox="0 0 400 300" className="w-full max-w-[380px] h-auto">
                  <defs>
                    <clipPath id="clipB_cond">
                      <circle cx="250" cy="150" r="80" />
                    </clipPath>
                  </defs>

                  {/* Sample Space Box */}
                  <rect x="10" y="10" width="380" height="280" fill={isConditional ? "#020617" : "#1e293b"} stroke="#cbd5e1" strokeWidth="2" className="transition-all duration-1000" />
                  <text x="15" y="25" fill="#cbd5e1" fontSize="12" fontWeight="bold" opacity={isConditional ? 0.2 : 1}>S</text>

                  {/* Circle A (Base) */}
                  <circle cx="150" cy="150" r="80" fill="#3b82f6" fillOpacity={isConditional ? 0.1 : 0.7} className="transition-all duration-1000" />
                  {/* Circle B (Base) */}
                  <circle cx="250" cy="150" r="80" fill="#10b981" fillOpacity={isConditional ? 0.8 : 0.7} className="transition-all duration-1000" />
                  
                  {/* Intersection (Always visible, but changes relative brightness) */}
                  <circle cx="150" cy="150" r="80" fill={isConditional ? "#3b82f6" : "#3b82f6"} clipPath="url(#clipB_cond)" fillOpacity={isConditional ? 1 : 0.7} className="transition-all duration-1000" />

                  <text x="110" y="155" fill="#ffffff" fontSize="20" fontWeight="bold" opacity={isConditional ? 0.1 : 1} className="transition-all duration-1000">A</text>
                  <text x="290" y="155" fill="#ffffff" fontSize="20" fontWeight="bold" opacity={isConditional ? 0.4 : 1} className="transition-all duration-1000">B</text>
                  
                  {isConditional && (
                    <text x="200" y="155" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle" className="animate-in zoom-in duration-500 delay-300">A ∩ B</text>
                  )}
                </svg>
             </div>
             
             {isConditional && (
                <div className="absolute bottom-4 right-4 bg-emerald-900/80 border border-emerald-500/50 px-3 py-1.5 rounded text-emerald-200 text-xs font-bold animate-in fade-in">
                  New Sample Space = B
                </div>
             )}
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};


const SlideConditionalExamples = () => {
  const [givenApt, setGivenApt] = useState(false);

  return (
    <SlideFrame>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Examples of Conditional Probability</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Example 1: Die Roll */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-md flex flex-col">
             <h3 className="text-xl font-bold text-blue-400 mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
               <Dices className="w-5 h-5"/> Example 1: Rolling a Die
             </h3>
             <p className="text-sm text-slate-300 mb-4">
               What is the probability of rolling a 4, <em>given</em> that we know the roll was an even number?
             </p>
             
             <ul className="space-y-3 text-sm font-mono bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 mb-6">
               <li><span className="text-blue-300">Event A (Roll 4):</span> {'{4}'}</li>
               <li><span className="text-emerald-300">Event B (Even):</span> {'{2, 4, 6}'}</li>
               <li><span className="text-purple-300">A ∩ B (Both):</span> {'{4}'}</li>
             </ul>

             <div className="flex items-center justify-center font-serif text-lg text-white bg-slate-900 py-4 rounded-xl shadow-inner border border-slate-800 mt-auto">
                <span className="mr-3 text-slate-300">P(4 | Even) =</span>
                <div className="flex flex-col items-center">
                  <span className="border-b border-slate-500 px-2 pb-1 text-purple-400">P(A ∩ B)</span>
                  <span className="pt-1 text-emerald-400">P(B)</span>
                </div>
                <span className="mx-3 text-slate-500">=</span>
                <div className="flex flex-col items-center">
                  <span className="border-b border-slate-500 px-2 pb-1 text-purple-400">1/6</span>
                  <span className="pt-1 text-emerald-400">3/6</span>
                </div>
                <span className="mx-3 text-slate-500">=</span>
                <span className="text-2xl text-blue-400 font-bold">1/3</span>
             </div>
          </div>

          {/* Example 2: Survey Data */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col relative overflow-hidden">
             <h3 className="text-xl font-bold text-emerald-400 mb-4 border-b border-slate-800 pb-2 flex items-center justify-between">
               <div className="flex items-center gap-2"><Table className="w-5 h-5"/> Example 2: Survey Data</div>
             </h3>

             <div className="overflow-x-auto mb-4">
               <table className="w-full text-sm text-left">
                 <thead className="text-xs text-slate-400 uppercase bg-slate-800 border-b border-slate-700">
                   <tr>
                     <th className="px-4 py-3 rounded-tl-lg">Housing</th>
                     <th className="px-4 py-3">Has Cat</th>
                     <th className="px-4 py-3">No Cat</th>
                     <th className="px-4 py-3 rounded-tr-lg">Total</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800">
                   <tr className={`transition-all duration-500 ${givenApt ? 'bg-emerald-900/30 font-bold' : 'bg-slate-800/30'}`}>
                     <td className="px-4 py-3 text-slate-200">Apartment</td>
                     <td className={`px-4 py-3 transition-colors ${givenApt ? 'text-blue-400' : 'text-slate-300'}`}>15</td>
                     <td className="px-4 py-3 text-slate-300">35</td>
                     <td className={`px-4 py-3 transition-colors ${givenApt ? 'text-emerald-400' : 'text-slate-300'}`}>50</td>
                   </tr>
                   <tr className={`transition-all duration-500 ${givenApt ? 'opacity-20 grayscale' : 'bg-slate-800/10'}`}>
                     <td className="px-4 py-3 text-slate-200">House</td>
                     <td className="px-4 py-3 text-slate-300">25</td>
                     <td className="px-4 py-3 text-slate-300">25</td>
                     <td className="px-4 py-3 text-slate-300">50</td>
                   </tr>
                   <tr className={`transition-all duration-500 font-bold ${givenApt ? 'opacity-20 grayscale' : 'bg-slate-800/50'}`}>
                     <td className="px-4 py-3 text-slate-200">Total</td>
                     <td className="px-4 py-3 text-slate-300">40</td>
                     <td className="px-4 py-3 text-slate-300">60</td>
                     <td className="px-4 py-3 text-white">100</td>
                   </tr>
                 </tbody>
               </table>
             </div>

             <div className="space-y-4 mt-auto">
               <div className="text-sm text-slate-300 mb-2">
                 <MathExpr>{"P(\\text{Cat} | \\text{Apartment}) = ?"}</MathExpr>
               </div>
               
               {/* Formal Calculation Box */}
               <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">1. Formal Calculation</p>
                 <ul className="text-xs font-mono text-slate-400 space-y-1 mb-3">
                   <li>P(Apt) = 50/100 = 0.5</li>
                   <li>P(Cat ∩ Apt) = 15/100 = 0.15</li>
                 </ul>
                 <div className="flex items-center text-white font-serif justify-center text-sm overflow-x-auto whitespace-nowrap">
                   <span>P(Cat|Apt) =</span>
                   <div className="flex flex-col items-center mx-2">
                     <span className="border-b border-slate-500 px-1 pb-0.5">15/100</span>
                     <span className="pt-0.5">50/100</span>
                   </div>
                   <span>=</span>
                   <div className="flex flex-col items-center mx-2">
                     <span className="border-b border-slate-500 px-1 pb-0.5 text-purple-400">0.15</span>
                     <span className="pt-0.5 text-emerald-400">0.50</span>
                   </div>
                   <span>=</span>
                   <div className="flex flex-col items-center mx-2">
                     <span className="border-b border-slate-500 px-1 pb-0.5 text-blue-400">15</span>
                     <span className="pt-0.5 text-emerald-400">50</span>
                   </div>
                   <span>= <span className="font-bold text-emerald-400">0.3</span></span>
                 </div>
               </div>

               {/* Intuitive Check */}
               <div className="bg-emerald-900/20 p-4 rounded-xl border border-emerald-500/30 flex flex-col gap-3">
                 <div className="flex items-center justify-between">
                   <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">2. Intuitive Check</p>
                   <button 
                      onClick={() => setGivenApt(!givenApt)}
                      className={`text-xs font-sans px-3 py-1 rounded transition-all shadow-md ${givenApt ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}
                   >
                     {givenApt ? "Reset Table" : "Apply Condition"}
                   </button>
                 </div>
                 
                 {givenApt ? (
                   <div className="animate-in fade-in flex items-center justify-between">
                     <span className="text-xs text-slate-300 flex-1 pr-4">If we <em>know</em> they live in an apartment, we only care about the highlighted row!</span>
                     <div className="font-serif text-lg text-white flex items-center shrink-0">
                       <div className="flex flex-col items-center mr-2">
                          <span className="border-b border-slate-500 px-1 pb-1 text-blue-400">15</span>
                          <span className="pt-1 text-emerald-400">50</span>
                       </div>
                       <span className="text-emerald-400 font-bold">= 0.3</span>
                     </div>
                   </div>
                 ) : (
                   <div className="text-xs text-slate-400 italic">
                     Click "Apply Condition" to visually reduce the sample space.
                   </div>
                 )}
               </div>
             </div>
          </div>
        </div>

        {/* Relevance to Machine Learning */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 rounded-2xl shadow-xl shrink-0">
          <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5"/> Relevance to Machine Learning
          </h3>
          <p className="text-sm text-slate-300 mb-6">
            Conditional probability is a foundational concept in many areas of machine learning, allowing us to quantify how different pieces of information relate to each other.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-slate-800/50 p-5 rounded-xl shadow-inner border border-slate-700/50">
                <h4 className="font-bold text-white mb-2 text-sm flex items-center gap-2"><Target className="w-4 h-4 text-rose-400"/> Classification Models</h4>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Models often estimate the probability that an input belongs to a certain class <em>given</em> its features: <MathExpr>P(Class | Features)</MathExpr>.
                </p>
                <div className="bg-slate-900 p-3 rounded font-mono text-xs text-blue-300 border border-slate-800 shadow-sm">
                  Ex: P(Spam | Email contains 'free money')
                </div>
             </div>
             <div className="bg-slate-800/50 p-5 rounded-xl shadow-inner border border-slate-700/50">
                <h4 className="font-bold text-white mb-2 text-sm flex items-center gap-2"><RefreshCw className="w-4 h-4 text-blue-400"/> Bayesian Methods</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Bayes' Theorem, which we will introduce next, is built directly upon conditional probability. It is used extensively in modeling uncertainty, probabilistic programming, and systematically updating our beliefs as new data arrives.
                </p>
             </div>
          </div>
        </div>

      </div>
    </SlideFrame>
  );
};

const SlideIndependence = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Independent vs. Dependent Events</h2>
      <p className="text-slate-300 text-lg mb-6 leading-relaxed">
        A primary aspect of understanding relationships between events is distinguishing between <strong>independence</strong> and <strong>dependence</strong>. This describes whether the occurrence of one event affects the probability of another.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        
        <div className="flex flex-col gap-6">
           <HighlightBox icon={RefreshCw} title="What Does Independence Mean?" color="emerald">
             <p className="text-[15px] mb-4">
               Two events, A and B, are independent if the occurrence of one event <em>does not affect</em> the probability of the other event occurring. They have "no memory" of each other.
             </p>
             <p className="text-[15px] font-bold text-slate-200 mb-2">Formal Definitions:</p>
             <ul className="space-y-3 font-serif text-lg bg-slate-900 p-4 rounded-lg border border-slate-700 text-emerald-300 shadow-inner">
               <li className="flex items-center gap-4"><span className="text-sm font-sans text-slate-500 uppercase tracking-widest w-24">Using Cond:</span> P(A|B) = P(A)</li>
               <li className="flex items-center gap-4"><span className="text-sm font-sans text-slate-500 uppercase tracking-widest w-24">Using Joint:</span> P(A ∩ B) = P(A)P(B)</li>
             </ul>
           </HighlightBox>
        </div>

        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl flex flex-col justify-center">
           <h3 className="text-xl font-bold text-blue-400 mb-6 border-b border-slate-700 pb-2 flex items-center gap-2">
             <Coins className="w-5 h-5"/> Example: Coin Flips
           </h3>
           <p className="text-sm text-slate-300 mb-6">
             Think about flipping a fair coin twice. Does the outcome of the first flip change the probability of getting Heads on the second flip? <strong>No.</strong>
           </p>
           
           <div className="space-y-4 font-mono text-sm bg-slate-800 p-5 rounded-xl border border-slate-700">
             <div className="flex justify-between items-center text-slate-200">
               <span>P(Heads on Flip 1):</span>
               <span className="text-blue-300 font-bold">1/2</span>
             </div>
             <div className="flex justify-between items-center text-slate-200 border-b border-slate-700 pb-4">
               <span>P(Heads on Flip 2):</span>
               <span className="text-emerald-300 font-bold">1/2</span>
             </div>
             
             <div className="pt-2 text-slate-300">
               What is P(Heads on Both)? <MathExpr>P(A \cap B)</MathExpr>
             </div>
             <div className="flex items-center justify-between text-white text-lg">
               <span>(1/2) × (1/2)</span>
               <ArrowRight className="w-4 h-4 text-slate-500" />
               <span className="text-purple-400 font-bold text-2xl">1/4</span>
             </div>
             <p className="text-xs text-slate-500 mt-2 italic text-right">
               (HH, HT, TH, TT) &rarr; only HH satisfies. 1/4 holds true!
             </p>
           </div>
        </div>

      </div>
    </div>
  </SlideFrame>
);


const SlideDependence = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Dependence & ML Relevance</h2>
      
      {/* Dependence Explanation Section */}
      <div className="bg-slate-800 p-6 md:p-8 rounded-2xl border border-slate-700 shadow-md flex flex-col">
         <h3 className="text-2xl font-bold text-rose-400 mb-4 border-b border-slate-700 pb-3 flex items-center gap-2">
           <GitMerge className="w-6 h-6"/> What Does Dependence Mean?
         </h3>
         <p className="text-slate-300 mb-6 leading-relaxed">
           If the occurrence of one event <em>does</em> affect the probability of another event occurring, the events are <strong>dependent</strong>. A classic example is drawing two cards from a standard 52-card deck <strong>without replacement</strong>.
         </p>
         
         <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 text-slate-300 mb-6 font-mono text-sm">
           Event A: Drawing a King on the first draw.<br/>
           Event B: Drawing a King on the second draw.
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Proof 1: Conditional Probability */}
           <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 space-y-4">
             <h4 className="font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
               <span className="bg-blue-500/20 text-blue-400 w-6 h-6 flex items-center justify-center rounded-full text-xs">1</span> 
               Using Conditional Probability
             </h4>
             
             <div className="space-y-3 font-mono text-sm text-slate-300">
               <div className="flex justify-between items-center">
                 <span>P(A) = 4/52 =</span>
                 <span className="text-blue-300 font-bold">1/13</span>
               </div>
               <div className="flex justify-between items-center">
                 <span>P(B | A) = 3/51 =</span>
                 <span className="text-rose-400 font-bold">1/17</span>
               </div>
             </div>
             
             <p className="text-xs text-slate-400 leading-relaxed mt-4 border-t border-slate-800 pt-4">
               If we drew a King first, there are only 3 Kings left out of 51 total cards. Since <span className="text-rose-400 font-bold">P(B|A) ≠ P(B)</span> (intuitively, P(B) would be 1/13 if we didn't know the first card), the outcome of the first draw changed the probability for the second. Therefore, they are dependent.
             </p>
           </div>

           {/* Proof 2: Joint Probability */}
           <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 space-y-4">
             <h4 className="font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
               <span className="bg-emerald-500/20 text-emerald-400 w-6 h-6 flex items-center justify-center rounded-full text-xs">2</span> 
               Using Joint Probability
             </h4>
             
             <div className="space-y-4 font-mono text-xs md:text-sm text-slate-300">
               <div>
                 <span className="text-emerald-400 block mb-1">True Joint Prob: P(A ∩ B) = P(B|A)P(A)</span>
                 (3/51) × (4/52) = 12/2652 <span className="text-emerald-300 font-bold">≈ 0.0045</span>
               </div>
               <div>
                 <span className="text-orange-400 block mb-1">Product of Individuals: P(A)P(B)</span>
                 (4/52) × (4/52) = 1/169 <span className="text-orange-300 font-bold">≈ 0.0059</span>
               </div>
             </div>
             
             <p className="text-xs text-slate-400 leading-relaxed mt-4 border-t border-slate-800 pt-4">
               Since <span className="text-orange-400 font-bold">P(A ∩ B) ≠ P(A)P(B)</span>, the events are confirmed dependent. The act of drawing without replacement permanently links the outcomes.
             </p>
           </div>
         </div>
      </div>

      {/* Machine Learning Relevance Section */}
      <div className="flex flex-col gap-6 mt-6">
         <HighlightBox icon={Brain} title="Why Independence Matters in Machine Learning" color="purple">
           <p className="text-base leading-relaxed">
             The concepts of independence and dependence are fundamental in many areas of machine learning:
           </p>
         </HighlightBox>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-slate-900 p-6 rounded-xl border-t-4 border-blue-500 shadow-md flex flex-col">
             <h4 className="font-bold text-white mb-3 text-base">1. Feature Engineering</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               When selecting features for a model, understanding if features are dependent can be important. Highly dependent features might be redundant, providing similar information. Sometimes, combining dependent features or removing one can improve model performance or reduce complexity.
             </p>
           </div>

           <div className="bg-slate-900 p-6 rounded-xl border-t-4 border-emerald-500 shadow-md flex flex-col">
             <h4 className="font-bold text-white mb-3 text-base">2. Model Assumptions</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               Some models make explicit assumptions about independence. A classic example is the <strong>Naive Bayes classifier</strong>. It works by assuming that all input features are independent of each other, <em>given</em> the class label. This is a "naive" assumption, but this simplification makes calculations much easier and the model surprisingly effective.
             </p>
           </div>

           <div className="bg-slate-900 p-6 rounded-xl border-t-4 border-rose-500 shadow-md flex flex-col">
             <h4 className="font-bold text-white mb-3 text-base">3. Probability Models</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               When building probabilistic models (like Bayesian networks), the dependencies between variables are explicitly mapped out. Independence allows for massive simplifications in the model structure and calculations.
             </p>
           </div>
         </div>
         
         <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-sm md:text-base text-slate-300 leading-relaxed text-center shadow-inner mt-4">
           In summary, distinguishing between independent and dependent events allows us to correctly calculate probabilities involving multiple events. Independence simplifies calculations (<MathExpr>{"P(A \\cap B) = P(A)P(B)"}</MathExpr>), while dependence requires using conditional probabilities (<MathExpr>{"P(A \\cap B) = P(A|B)P(A)"}</MathExpr>).
         </div>
      </div>
    </div>
  </SlideFrame>
);

const SlideBayesIntro = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Introduction to Bayes' Theorem</h2>
      <p className="text-slate-300 text-lg mb-6 leading-relaxed">
        Conditional probability, <MathExpr>{"P(A|B)"}</MathExpr>, expresses the likelihood of an event A happening <em>given</em> that event B has already occurred. A famous and incredibly useful result that relates to this concept is <strong>Bayes' Theorem</strong>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        <div className="flex flex-col gap-6">
           <HighlightBox icon={RefreshCw} title="Updating Beliefs" color="emerald">
             <p className="text-[15px] mb-4">
               Imagine you have an initial belief about something (a hypothesis), and then you receive some new data or evidence. How should that new evidence change your belief? 
             </p>
             <p className="text-[15px]">
               Bayes' Theorem provides a formal mathematical way to do exactly this: <strong>update your beliefs in light of new evidence.</strong>
             </p>
           </HighlightBox>

           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
             <h4 className="font-bold text-blue-400 mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
               <FlaskConical className="w-5 h-5"/> A Common Scenario: Medical Testing
             </h4>
             <ul className="space-y-3 text-sm text-slate-300">
               <li>Let <strong className="text-white">D</strong> be the event that a person has a particular disease.</li>
               <li>Let <strong className="text-emerald-400">T</strong> be the event that the person tests positive for the disease.</li>
             </ul>
           </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl flex flex-col justify-center">
           <h3 className="text-xl font-bold text-slate-200 mb-6">What We Know vs. What We Want</h3>
           
           <div className="space-y-6">
             <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">We often know:</span>
               <ul className="space-y-2 text-sm text-slate-300">
                 <li><MathExpr>{"P(T|D)"}</MathExpr>: Probability of testing positive <em>if</em> you have the disease (Sensitivity).</li>
                 <li><MathExpr>{"P(T|not D)"}</MathExpr>: Probability of testing positive even <em>if you don't</em> have the disease (False Positive).</li>
                 <li><MathExpr>{"P(D)"}</MathExpr>: Overall probability of having the disease <em>before</em> the test (<strong>Prior Probability</strong>).</li>
               </ul>
             </div>

             <div className="flex justify-center"><ArrowDown className="w-6 h-6 text-slate-600"/></div>

             <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/30">
               <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-2">What we actually want to know:</span>
               <p className="text-sm text-blue-100">
                 <MathExpr>{"P(D|T)"}</MathExpr>: The probability that you <em>actually</em> have the disease <strong>given</strong> that you tested positive!
               </p>
             </div>
           </div>

           <p className="text-xs text-slate-400 mt-6 text-center italic">
             We know <MathExpr>{"P(Evidence|Hypothesis)"}</MathExpr> but we want <MathExpr>{"P(Hypothesis|Evidence)"}</MathExpr>. Bayes' Theorem flips the condition!
           </p>
        </div>
      </div>
    </div>
  </SlideFrame>
);

const SlideBayesFormula = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-grow">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">The Formula</h2>
      
      <div className="bg-slate-900 py-8 px-6 rounded-3xl border border-slate-800 shadow-2xl flex flex-col items-center justify-center mb-6">
        <span className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">Bayes' Theorem</span>
        <div className="flex items-center text-2xl md:text-4xl font-serif text-white flex-wrap justify-center gap-y-4">
          <span className="text-blue-400 mr-4">P(D|T)</span>
          <span className="mr-4">=</span>
          <div className="flex flex-col items-center">
            <span className="border-b border-slate-500 px-4 pb-2 text-emerald-400">P(T|D) × P(D)</span>
            <span className="pt-2 text-orange-400">P(T)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        
        {/* Term Breakdown */}
        <div className="space-y-4">
          <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-blue-500 shadow-md">
            <h4 className="font-bold text-blue-400 mb-1 font-serif text-lg">P(D|T) : Posterior Probability</h4>
            <p className="text-sm text-slate-300">The <em>updated</em> probability of having the disease after observing the evidence (testing positive). This is our goal.</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-emerald-500 shadow-md">
            <h4 className="font-bold text-emerald-400 mb-1 font-serif text-lg">P(T|D) : Likelihood</h4>
            <p className="text-sm text-slate-300">The probability of observing the evidence (positive test) given that the hypothesis (having the disease) is true.</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-emerald-300 shadow-md">
            <h4 className="font-bold text-emerald-300 mb-1 font-serif text-lg">P(D) : Prior Probability</h4>
            <p className="text-sm text-slate-300">Our initial belief about the hypothesis <em>before</em> seeing the evidence (the disease's base prevalence).</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-orange-400 shadow-md">
            <h4 className="font-bold text-orange-400 mb-1 font-serif text-lg">P(T) : Probability of the Evidence</h4>
            <p className="text-sm text-slate-300">The overall probability of testing positive, regardless of whether you have the disease or not. It acts as a normalizer.</p>
          </div>
        </div>

        {/* Expanding the Denominator */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-center">
           <h3 className="text-lg font-bold text-orange-400 mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
             <Scale className="w-5 h-5"/> Expanding the Denominator P(T)
           </h3>
           <p className="text-sm text-slate-300 mb-4 leading-relaxed">
             How do we find <MathExpr>{"P(T)"}</MathExpr>? A person can test positive in two mutually exclusive ways: they have the disease AND test positive, OR they don't have the disease AND test positive (false positive).
           </p>
           
           <div className="space-y-4 font-serif text-sm md:text-base text-slate-200 bg-slate-800 p-4 rounded-xl border border-slate-700">
             <div>P(T) = P(T ∩ D) + P(T ∩ not D)</div>
             <div className="text-slate-400 text-xs font-sans italic my-2">Using conditional probability definition:</div>
             <div className="text-orange-300 font-bold">P(T) = P(T|D)P(D) + P(T|not D)P(not D)</div>
           </div>

           <p className="text-sm text-slate-400 mt-6 leading-relaxed">
             This means the full formula is often written with this expanded denominator, which simply sums up the probabilities of <em>all the ways</em> the positive test could have happened!
           </p>
        </div>

      </div>
    </div>
  </SlideFrame>
);

const SlideBayesInteractive = () => {
  const [prior, setPrior] = useState(1);       // P(D) in percentage
  const [tpr, setTpr] = useState(95);          // P(T|D) in percentage
  const [fpr, setFpr] = useState(5);           // P(T|not D) in percentage

  // Math conversions
  const p_D = prior / 100;
  const p_notD = 1 - p_D;
  const p_T_given_D = tpr / 100;
  const p_T_given_notD = fpr / 100;

  // Numerator: P(T|D) * P(D) -> True Positives
  const truePositives = p_T_given_D * p_D;
  
  // Denominator Part 2: P(T|not D) * P(not D) -> False Positives
  const falsePositives = p_T_given_notD * p_notD;

  // Denominator: P(T)
  const p_T = truePositives + falsePositives;

  // Posterior: P(D|T)
  const posterior = p_T > 0 ? (truePositives / p_T) : 0;

  return (
    <SlideFrame>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <h2 className="text-3xl font-bold text-white mb-2">Interactive Bayes: The Medical Test</h2>
        <p className="text-slate-300 text-lg mb-6">
          Adjust the disease prevalence and test accuracy below. Notice how a "highly accurate" 95% test can yield a surprisingly low actual probability of having the disease if the disease is rare!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          
          {/* Controls */}
          <div className="space-y-6">
             <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-md space-y-6">
               
               <div>
                 <div className="flex justify-between mb-2">
                   <label className="text-sm font-bold text-slate-300">1. Prior Belief P(D)</label>
                   <span className="text-emerald-400 font-mono font-bold">{prior}%</span>
                 </div>
                 <input type="range" min="0.1" max="50" step="0.1" value={prior} onChange={(e)=>setPrior(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                 <p className="text-xs text-slate-500 mt-1">Disease prevalence in the population.</p>
               </div>

               <div className="border-t border-slate-700 pt-4">
                 <div className="flex justify-between mb-2">
                   <label className="text-sm font-bold text-slate-300">2. Sensitivity P(T|D)</label>
                   <span className="text-blue-400 font-mono font-bold">{tpr}%</span>
                 </div>
                 <input type="range" min="50" max="100" step="1" value={tpr} onChange={(e)=>setTpr(parseFloat(e.target.value))} className="w-full accent-blue-500" />
                 <p className="text-xs text-slate-500 mt-1">True Positive Rate (Test catches the disease).</p>
               </div>

               <div className="border-t border-slate-700 pt-4">
                 <div className="flex justify-between mb-2">
                   <label className="text-sm font-bold text-slate-300">3. False Positive P(T|not D)</label>
                   <span className="text-rose-400 font-mono font-bold">{fpr}%</span>
                 </div>
                 <input type="range" min="0" max="20" step="0.1" value={fpr} onChange={(e)=>setFpr(parseFloat(e.target.value))} className="w-full accent-rose-500" />
                 <p className="text-xs text-slate-500 mt-1">Test is positive, but patient is healthy.</p>
               </div>

             </div>
             
             {posterior < 0.5 && prior < 5 && (
                <div className="bg-orange-900/30 border border-orange-500/50 p-4 rounded-xl flex items-start gap-3 animate-in fade-in zoom-in">
                  <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-200">
                    <strong>The Base Rate Fallacy:</strong> Even with a 95% accurate test, because the disease is rare (1%), most positive results are actually false alarms from the healthy 99%!
                  </p>
                </div>
             )}
          </div>

          {/* Visual Calculation Flow */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 md:p-8 flex flex-col relative overflow-hidden min-h-[400px]">
             
             <div className="flex flex-col items-center gap-6 h-full justify-center">
                
                {/* Prior Box */}
                <div className="bg-emerald-900/30 border border-emerald-500/50 px-6 py-3 rounded-lg text-center shadow-lg w-full max-w-[250px]">
                  <div className="text-xs text-emerald-400 uppercase tracking-widest mb-1 font-bold">Prior Belief</div>
                  <div className="font-serif text-2xl text-white">P(D) = {p_D.toFixed(3)}</div>
                </div>

                <ArrowDown className="w-6 h-6 text-slate-600" />

                {/* Calculation Engine */}
                <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl w-full">
                  <div className="flex items-center text-xl md:text-2xl font-serif text-white justify-center flex-wrap gap-y-4">
                    <span className="text-blue-400 mr-4">P(D|T)</span>
                    <span className="mr-4">=</span>
                    <div className="flex flex-col items-center text-sm md:text-lg">
                      <span className="border-b border-slate-500 px-4 pb-2 text-emerald-400">
                        {p_T_given_D.toFixed(3)} × {p_D.toFixed(3)}
                      </span>
                      <span className="pt-2 text-orange-400 flex items-center gap-2">
                        <span>({p_T_given_D.toFixed(3)} × {p_D.toFixed(3)})</span>
                        <span className="text-slate-400">+</span>
                        <span>({p_T_given_notD.toFixed(3)} × {p_notD.toFixed(3)})</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center text-lg font-serif text-white justify-center mt-6">
                    <span className="mr-4 text-slate-500">=</span>
                    <div className="flex flex-col items-center">
                      <span className="border-b border-slate-500 px-4 pb-1 text-emerald-400">{truePositives.toFixed(4)} <span className="text-xs text-slate-500 font-sans">(True Pos)</span></span>
                      <span className="pt-1 text-orange-400">{p_T.toFixed(4)} <span className="text-xs text-slate-500 font-sans">(Total Pos)</span></span>
                    </div>
                  </div>
                </div>

                <ArrowDown className="w-6 h-6 text-slate-600" />

                {/* Posterior Box */}
                <div className={`border px-6 py-4 rounded-xl text-center shadow-lg w-full max-w-[250px] transition-colors duration-500 ${posterior > 0.5 ? 'bg-blue-900/40 border-blue-500' : 'bg-rose-900/20 border-rose-500/50'}`}>
                  <div className="text-xs uppercase tracking-widest mb-1 font-bold text-slate-300">Posterior Belief</div>
                  <div className="font-serif text-3xl text-white font-bold">{(posterior * 100).toFixed(1)}%</div>
                  <div className="text-xs text-slate-400 mt-2">Chance you actually have it.</div>
                </div>

             </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const SlideBayesML = () => (
  <SlideFrame>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Relevance to Machine Learning</h2>
      
      <p className="text-slate-300 text-lg mb-8 leading-relaxed">
        Bayes' Theorem is far more than just a formula; it is a fundamental concept for <strong>reasoning under uncertainty</strong>. It forms the backbone of how both humans and machines learn from data.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
        
        <div className="bg-slate-800 p-6 rounded-2xl border-t-4 border-t-blue-500 shadow-lg flex flex-col">
          <Target className="w-8 h-8 text-blue-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-3">Classification Models</h3>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Some algorithms are directly built on applying Bayes' Theorem. The most famous is the <strong>Naive Bayes classifier</strong>. 
          </p>
          <p className="text-sm text-slate-300 leading-relaxed mt-auto">
            It calculates the probability of a class given the observed features: <br/>
            <span className="font-mono text-blue-300 bg-slate-900 px-2 py-1 rounded block mt-2 border border-slate-700">P(Spam | Words in Email)</span>
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border-t-4 border-t-emerald-500 shadow-lg flex flex-col">
          <RefreshCw className="w-8 h-8 text-emerald-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-3">Updating Models</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            The core idea of updating beliefs based on data mirrors how many machine learning models learn. 
          </p>
          <p className="text-sm text-slate-300 leading-relaxed mt-4">
            Models start with some initial parameters (<strong>prior beliefs</strong>). As they process training data (<strong>evidence</strong>), they systematically adjust those parameters to form better, more accurate models (<strong>posterior beliefs</strong>).
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border-t-4 border-t-purple-500 shadow-lg flex flex-col">
          <Brain className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-3">Bayesian Methods</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            There is an entire branch of statistics and machine learning called <strong>Bayesian methods</strong>. 
          </p>
          <p className="text-sm text-slate-300 leading-relaxed mt-4">
            Instead of giving a single "best guess" prediction, Bayesian networks use this theorem extensively to model uncertainty, outputting a full probability distribution of possible outcomes.
          </p>
        </div>

      </div>

      <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl mt-6 shadow-inner text-center">
         <p className="text-slate-300 text-base leading-relaxed max-w-4xl mx-auto">
           While complex Bayesian modeling goes beyond basic introductions, understanding the core mechanism of Bayes' Theorem is crucial. It formally defines the intuitive process of <strong>adjusting your understanding as you gather more information</strong>.
         </p>
      </div>

    </div>
  </SlideFrame>
);

const SlideBayesVisualProof = () => {
  const [step, setStep] = useState(0);

  // Generate grid data
  const grid = [];
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 21; c++) {
      const isH = c === 0;
      const isE = isH ? r >= 6 : r === 9; // Bottom 4 of col 0, bottom 1 of cols 1-20
      
      let type = 'none';
      if (isH && isE) type = 'H_E';
      else if (isH && !isE) type = 'H_notE';
      else if (!isH && isE) type = 'notH_E';
      else if (!isH && !isE) type = 'notH_notE';

      grid.push({ r, c, type, isH, isE });
    }
  }

  return (
    <SlideFrame>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full flex-grow">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end mb-2 shrink-0 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Visualizing Bayes' Theorem</h2>
            <p className="text-slate-300 text-lg">
              Let's look at the famous "Librarian vs. Farmer" visual proof.
            </p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={() => setStep(p => Math.max(0, p - 1))}
               disabled={step === 0}
               className="px-4 py-2 bg-slate-800 text-white rounded-lg font-bold shadow-md transition-all disabled:opacity-30"
             >
               Previous
             </button>
             <button 
               onClick={() => setStep(p => Math.min(3, p + 1))}
               disabled={step === 3}
               className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-md transition-all disabled:opacity-30"
             >
               Next Step
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow min-h-0">
          
          {/* Explanation Panel */}
          <div className="flex flex-col gap-4">
             {/* Step 0 */}
             <div className={`bg-slate-800 p-5 rounded-xl border transition-all duration-500 ${step === 0 ? 'border-yellow-500 shadow-md' : 'border-slate-700 opacity-50'}`}>
               <h4 className="font-bold text-yellow-400 mb-2">1. The Prior: P(H)</h4>
               <p className="text-sm text-slate-300">
                 Imagine 210 people. Our hypothesis (H) is that a randomly chosen person is a Librarian. We know 1 in 21 people are Librarians. So, <strong className="text-white">10 are Librarians</strong> (left column), and 200 are not.
               </p>
             </div>

             {/* Step 1 */}
             <div className={`bg-slate-800 p-5 rounded-xl border transition-all duration-500 ${step === 1 ? 'border-blue-400 shadow-md' : 'border-slate-700 opacity-50'}`}>
               <h4 className="font-bold text-blue-400 mb-2">2. The Likelihood: P(E|H)</h4>
               <p className="text-sm text-slate-300">
                 We receive Evidence (E): they are "meek and tidy". <strong className="text-blue-300">40% of Librarians</strong> fit this description (4 out of 10, blue). However, <strong className="text-emerald-400">10% of Non-Librarians</strong> also fit it (20 out of 200, green).
               </p>
             </div>

             {/* Step 2 */}
             <div className={`bg-slate-800 p-5 rounded-xl border transition-all duration-500 ${step === 2 ? 'border-rose-400 shadow-md' : 'border-slate-700 opacity-50'}`}>
               <h4 className="font-bold text-rose-400 mb-2">3. Restricting the Sample Space: P(E)</h4>
               <p className="text-sm text-slate-300">
                 Because we <em>know</em> our person fits the description, we can entirely eliminate everyone who doesn't. Our universe shrinks from 210 people down to just the 24 people who fit the evidence!
               </p>
             </div>

             {/* Step 3 */}
             <div className={`bg-slate-800 p-5 rounded-xl border transition-all duration-500 ${step === 3 ? 'border-emerald-400 shadow-md scale-105' : 'border-slate-700 opacity-50'}`}>
               <h4 className="font-bold text-emerald-400 mb-2">4. The Posterior: P(H|E)</h4>
               <p className="text-sm text-slate-300">
                 Given they fit the description, what's the chance they are a librarian? It's simply the proportion of Librarians <em>within our new, smaller universe</em>.
               </p>
             </div>
          </div>

          {/* Visual Panel */}
          <div className="bg-[#0f1115] rounded-2xl border border-slate-800 shadow-xl flex flex-col items-center justify-center relative overflow-hidden p-2 md:p-6 min-h-[300px] lg:min-h-[400px]">
             
             {/* Grid View (Steps 0, 1, 2) */}
             <div className={`transition-all duration-700 absolute inset-0 flex items-center justify-center p-2 md:p-6 ${step < 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                 {/* 
                   The SVG Grid - Now with expanded viewBox (-180 to 670 width) 
                   to fit all labels natively inside the SVG for perfect scaling! 
                 */}
                 <svg viewBox="-180 -60 850 320" className="w-full h-full max-h-[400px] drop-shadow-lg">
                   
                   <defs>
                     <marker id="arrowHeadWhite" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                       <path d="M 0 0 L 10 5 L 0 10 z" fill="white" />
                     </marker>
                   </defs>

                   {/* Labels: Prior (Step 0) */}
                   <g className={`transition-opacity duration-500 ${step === 0 ? 'opacity-100' : 'opacity-0'}`}>
                     <text x="-5" y="-20" fill="#facc15" fontSize="28" fontFamily="serif" fontWeight="bold">"Prior" &rarr; P(H) = 1/21</text>
                     <rect x="-2" y="-2" width="24" height="204" fill="none" stroke="white" strokeWidth="2" />
                   </g>

                   {/* Labels: Likelihood (Step 1, 2) */}
                   <g className={`transition-opacity duration-500 ${step === 1 || step === 2 ? 'opacity-100' : 'opacity-0'}`}>
                     <text x="-160" y="100" fill="white" fontSize="24" fontFamily="serif">"Likelihood"</text>
                     {/* Down-right arrow */}
                     <line x1="-110" y1="110" x2="-125" y2="145" stroke="white" strokeWidth="2" markerEnd="url(#arrowHeadWhite)" />
                     
                     <text x="-170" y="195" fill="white" fontSize="26" fontFamily="serif">
                       P(<tspan fill="#60a5fa">E</tspan>|<tspan fill="#facc15">H</tspan>) = 0.4
                     </text>
                     {/* Curly brace matching the blue block */}
                     <path d="M -8 120 Q -25 120 -25 160 T -42 160 Q -25 160 -25 200 T -8 200" fill="none" stroke="white" strokeWidth="2" />
                   </g>

                   {/* Labels: Right Side (Step 1, 2) */}
                   <g className={`transition-opacity duration-500 ${step === 1 || step === 2 ? 'opacity-100' : 'opacity-0'}`}>
                     {/* Right arrow */}
                     <line x1="430" y1="190" x2="455" y2="190" stroke="white" strokeWidth="2" markerEnd="url(#arrowHeadWhite)" />
                     <text x="470" y="198" fill="white" fontSize="26" fontFamily="serif">
                       P(<tspan fill="#60a5fa">E</tspan>|<tspan fill="#fb7185">¬H</tspan>) = 0.1
                     </text>
                   </g>

                   {/* The People Icons */}
                   {grid.map((p, idx) => {
                     const x = p.c * 20;
                     const y = p.r * 20;
                     
                     let fill = '#4a5043'; // Default dark olive (notH_notE)
                     let stroke = 'none';
                     let opacity = 1;

                     if (p.type === 'H_notE') {
                       fill = 'transparent';
                       stroke = 'white';
                     } else if (p.type === 'H_E') {
                       fill = '#60a5fa'; // Blue
                     } else if (p.type === 'notH_E') {
                       fill = '#84cc16'; // Green
                     }

                     // Handle fade out for Step 2
                     if (step >= 2 && !p.isE) {
                       opacity = 0.05;
                     }

                     // Handle highlight for Step 1
                     if (step === 1 && p.isE && !p.isH) {
                       fill = '#a3e635'; // Brighter green
                     }

                     return (
                       <g key={idx} transform={`translate(${x}, ${y})`} className="transition-all duration-700" style={{ opacity }}>
                         <path 
                           d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" 
                           fill={fill} 
                           stroke={stroke}
                           strokeWidth={stroke !== 'none' ? "1.5" : "0"}
                           transform="scale(0.65) translate(2, 2)"
                         />
                       </g>
                     )
                   })}
                 </svg>
             </div>

             {/* Fraction View (Step 3) */}
             <div className={`transition-all duration-700 absolute inset-0 flex flex-col items-center justify-center p-4 md:p-6 ${step === 3 ? 'opacity-100 scale-100 delay-300' : 'opacity-0 scale-110 pointer-events-none'}`}>
               <h3 className="absolute top-6 md:top-10 font-serif text-2xl md:text-3xl text-emerald-400">Bayes' Theorem</h3>
               
               <div className="flex items-center gap-2 md:gap-4 text-xl md:text-3xl font-serif text-white flex-wrap justify-center mt-8">
                 <span className="shrink-0">P(<span className="text-yellow-400">H</span>|<span className="text-blue-400">E</span>) = </span>
                 
                 <div className="flex flex-col items-center">
                   {/* Numerator */}
                   <div className="flex items-center gap-1 pb-3 px-2 md:px-6">
                     {[...Array(4)].map((_, i) => (
                       <User key={`num-${i}`} className="w-4 h-4 md:w-5 md:h-5 text-blue-400" fill="currentColor" />
                     ))}
                   </div>
                   
                   {/* Divider */}
                   <div className="w-full h-px bg-white"></div>
                   
                   {/* Denominator */}
                   <div className="flex items-center gap-1 md:gap-2 pt-3 px-1 md:px-2 flex-wrap justify-center">
                     <div className="flex flex-col items-center">
                       <div className="flex items-center gap-1">
                         {[...Array(4)].map((_, i) => (
                           <User key={`den1-${i}`} className="w-4 h-4 md:w-5 md:h-5 text-blue-400" fill="currentColor" />
                         ))}
                       </div>
                     </div>
                     
                     <span className="text-lg md:text-xl mx-1 md:mx-2">+</span>
                     
                     <div className="flex flex-col items-center">
                       <div className="flex items-center gap-0.5 border-2 border-yellow-400 p-1 rounded max-w-[150px] md:max-w-none flex-wrap justify-center">
                         {[...Array(20)].map((_, i) => (
                           <User key={`den2-${i}`} className="w-3 h-3 md:w-4 md:h-4 text-emerald-500" fill="currentColor" />
                         ))}
                       </div>
                     </div>
                   </div>

                 </div>

                 <span className="shrink-0 mx-2">=</span>
                 
                 <div className="flex flex-col items-center text-3xl md:text-4xl shrink-0">
                   <span className="border-b border-white pb-1 px-4 text-blue-400">4</span>
                   <span className="pt-1 px-4 text-white">24</span>
                 </div>
               </div>
             </div>

          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

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
    <div className="flex flex-col h-full bg-[#111111] overflow-hidden">
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {React.createElement(slides[currentSlide].component)}
      </div>

      {/* Sticky Bottom Navigation Footer */}
      <div className="bg-[#111111] border-t border-slate-800 p-4 md:px-8 flex justify-between items-center shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
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

export default function BasicProbability8() {
  const slides = [
    { component: SlideIntro, title: 'Experiments & Sample Spaces' },
    { component: SlideEvents, title: 'Events (Subsets)' },
    { component: SlideCalculation, title: 'Calculating Probability' },
    { component: SlideComplement, title: 'Set Theory: Complement' },
    { component: SlideIntersectionUnion, title: 'Intersections & Unions' },
    { component: SlideAdditionRule, title: 'The Addition Rule' },
    { component: SlideConditionalIntro, title: 'Conditional Probability' },
    { component: SlideConditionalExamples, title: 'Conditional Examples' },
    { component: SlideIndependence, title: 'Independent Events' },
    { component: SlideDependence, title: 'Dependent Events & ML' },
    { component: SlideBayesIntro, title: 'Intro to Bayes Theorem' },
    { component: SlideBayesFormula, title: 'The Bayes Formula' },
    { component: SlideBayesVisualProof, title: 'Visualizing Bayes' },
    { component: SlideBayesInteractive, title: 'Interactive Bayes Calculator' },
    { component: SlideBayesML, title: 'Bayes in Machine Learning' },
  ];

  return <Slideshow slides={slides} />;
}