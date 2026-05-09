import React, { useState, useEffect } from 'react';
import { 
  Activity, ChevronLeft, ChevronRight, Code, Terminal, 
  TrendingUp, AlertTriangle, CheckCircle2, Pointer, XCircle, 
  Layers, Zap, Info, ArrowRight
} from 'lucide-react';

export default function ActivationSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'why', title: 'Why Non-Linearity?', component: WhyNonLinearSlide },
    { id: 'relu', title: 'ReLU Activation', component: ReLUSlide },
    { id: 'sigmoid_tanh', title: 'Sigmoid & Tanh', component: SigmoidTanhSlide },
    { id: 'choosing', title: 'Choosing an Activation', component: ChoosingSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Activity size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Activation Functions</h2>
        <p className="text-slate-400 text-sm mb-4">Introducing non-linearities: ReLU, Sigmoid, and Tanh</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2 flex-wrap">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 min-w-[30px] rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-purple-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase overflow-hidden">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-purple-400 whitespace-nowrap' : 'hidden md:inline whitespace-nowrap'}>
              {slide.title}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[550px] flex flex-col">
        <div className="flex-1">
          <CurrentComponent />
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
          <button 
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))} 
            disabled={currentSlide === 0} 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 font-semibold transition-colors"
          >
            <ChevronLeft size={20} /> Previous
          </button>
          <button 
            onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))} 
            disabled={currentSlide === slides.length - 1} 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 font-semibold transition-colors"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}

// --- Slide 1: Why Non-Linearity ---
function WhyNonLinearSlide() {
  const [step, setStep] = useState(0);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <h3 className="text-xl font-bold mb-4">Why do we need Activation Functions?</h3>
      <p className="text-slate-600 mb-6 leading-relaxed text-sm">
        Neural networks gain their representational power from <strong>non-linearities</strong>. If we simply stacked linear transformations (like <code>nn.Linear</code> layers) without activation functions, the entire network would mathematically collapse into a single linear transformation!
      </p>

      <div className="flex flex-col md:flex-row gap-8 flex-1">
        
        {/* Left Side: Interactive Linear Collapse */}
        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          
          <div className="flex justify-center gap-4 mb-8 w-full z-10">
            <button 
              onClick={() => setStep(0)}
              className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all border-2 ${step === 0 ? 'bg-rose-50 border-rose-500 text-rose-700 shadow' : 'bg-white border-slate-200 text-slate-500'}`}
            >
              Without Activation
            </button>
            <button 
              onClick={() => setStep(1)}
              className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all border-2 ${step === 1 ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow' : 'bg-white border-slate-200 text-slate-500'}`}
            >
              With Activation
            </button>
          </div>

          <div className="flex items-center justify-center w-full gap-4 relative z-10 min-h-[150px]">
             
             {step === 0 ? (
               <div className="flex flex-col items-center animate-in fade-in duration-500 w-full">
                 <div className="flex items-center gap-2 mb-4 w-full justify-center opacity-50">
                    <div className="px-4 py-2 bg-blue-100 text-blue-800 font-bold font-mono border border-blue-300 rounded shadow-sm">L1(x)</div>
                    <ArrowRight size={16}/>
                    <div className="px-4 py-2 bg-blue-100 text-blue-800 font-bold font-mono border border-blue-300 rounded shadow-sm">L2(x)</div>
                    <ArrowRight size={16}/>
                    <div className="px-4 py-2 bg-blue-100 text-blue-800 font-bold font-mono border border-blue-300 rounded shadow-sm">L3(x)</div>
                 </div>
                 
                 <ArrowRight size={24} className="text-rose-400 rotate-90 my-2"/>
                 
                 <div className="px-8 py-3 bg-rose-100 text-rose-800 font-bold font-mono border-2 border-rose-500 rounded-xl shadow-md flex flex-col items-center animate-pulse">
                    <span>L_equivalent(x)</span>
                    <span className="text-[10px] text-rose-600 uppercase mt-1">Collapsed to 1 Linear Layer</span>
                 </div>
               </div>
             ) : (
               <div className="flex flex-col items-center animate-in fade-in duration-500 w-full">
                 <div className="flex items-center gap-2 w-full justify-center">
                    <div className="px-3 py-2 bg-blue-100 text-blue-800 font-bold font-mono border border-blue-300 rounded shadow-sm">L1(x)</div>
                    <ArrowRight size={16} className="text-slate-400"/>
                    <div className="px-3 py-2 bg-purple-500 text-white font-bold font-mono rounded shadow-md ring-2 ring-purple-200 scale-110 rotate-3 z-10">ReLU</div>
                    <ArrowRight size={16} className="text-slate-400"/>
                    <div className="px-3 py-2 bg-blue-100 text-blue-800 font-bold font-mono border border-blue-300 rounded shadow-sm">L2(x)</div>
                    <ArrowRight size={16} className="text-slate-400"/>
                    <div className="px-3 py-2 bg-purple-500 text-white font-bold font-mono rounded shadow-md ring-2 ring-purple-200 scale-110 -rotate-3 z-10">ReLU</div>
                 </div>
                 <div className="mt-8 bg-emerald-50 text-emerald-800 text-xs px-4 py-2 rounded-lg border border-emerald-200 font-bold flex items-center gap-2">
                   <CheckCircle2 size={16}/> Network preserves complex capabilities!
                 </div>
               </div>
             )}

          </div>
        </div>

        {/* Right Side: Text explanation */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          <div className="bg-white border-l-4 border-purple-500 p-4 rounded-r-xl shadow-sm">
            <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
              <TrendingUp size={16} className="text-purple-500"/> The Math Perspective
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Applying a linear function to another linear function just creates a third linear function: <code>f(g(x)) = W2(W1*x) = (W2*W1)*x = W3*x</code>. To learn complex, curved boundaries, we must bend the data!
            </p>
          </div>
          
          <div className="bg-white border-l-4 border-indigo-500 p-4 rounded-r-xl shadow-sm">
            <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
              <Layers size={16} className="text-indigo-500"/> The Solution
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Activation functions are applied element-wise to the output of a layer (the <strong>logits</strong> or pre-activations), transforming the values non-linearly before passing them to the next layer.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Slide 2: ReLU ---
function ReLUSlide() {
  const [step, setStep] = useState(0);

  const pyCode = `import torch\nimport torch.nn as nn\n\n# Example usage\nrelu_activation = nn.ReLU()\n\ninput_tensor = torch.tensor([-3.0, -1.0, 0.0, 2.0, 4.0])\noutput_tensor = relu_activation(input_tensor)\n\nprint(f"Input: {input_tensor}")\nprint(f"Output after ReLU: {output_tensor}")\n\n# Example within a simple model\nclass SimpleNet(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.layer1 = nn.Linear(10, 20)\n        self.activation = nn.ReLU()\n        self.layer2 = nn.Linear(20, 5)\n\n    def forward(self, x):\n        x = self.layer1(x)\n        x = self.activation(x) # Apply ReLU\n        x = self.layer2(x)\n        return x`;

  const outCode = `Input: tensor([-3., -1.,  0.,  2.,  4.])\nOutput after ReLU: tensor([0., 0., 0., 2., 4.])`;

  const inputVals = [-3.0, -1.0, 0.0, 2.0, 4.0];

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2 h-full">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-2 text-purple-700">ReLU (Rectified Linear Unit)</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          The most popular activation in modern deep learning. It outputs the input directly if it's positive, and outputs zero otherwise: <code>ReLU(x) = max(0, x)</code>
        </p>

        {/* Visualizer */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center mb-6 shadow-sm">
          
          <div className="flex items-center gap-4 w-full justify-center mb-6">
             <div className="flex flex-col gap-1">
               <span className="text-[10px] font-bold text-slate-500 text-center uppercase">Input (x)</span>
               <div className="flex bg-white rounded border border-slate-300 shadow-sm overflow-hidden">
                 {inputVals.map((v, i) => (
                   <div key={i} className={`w-8 h-8 flex items-center justify-center font-mono text-xs border-r last:border-0 ${v < 0 ? 'text-rose-500' : 'text-slate-700'}`}>{v}</div>
                 ))}
               </div>
             </div>

             <div className="flex flex-col items-center pt-4 px-2">
               <ArrowRight className="text-slate-400" size={20}/>
               <span className="text-[10px] font-bold text-purple-600">nn.ReLU()</span>
             </div>

             <div className="flex flex-col gap-1">
               <span className="text-[10px] font-bold text-slate-500 text-center uppercase">Output (y)</span>
               <div className="flex bg-white rounded border border-slate-300 shadow-sm overflow-hidden">
                 {inputVals.map((v, i) => (
                   <div key={i} className={`w-8 h-8 flex items-center justify-center font-mono text-xs font-bold border-r last:border-0 transition-colors duration-700 ${v < 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                     {Math.max(0, v).toFixed(1)}
                   </div>
                 ))}
               </div>
             </div>
          </div>

          <div className="flex justify-center w-full relative">
            <svg viewBox="0 0 200 100" className="w-48 h-24 overflow-visible">
              <line x1="0" y1="80" x2="200" y2="80" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
              <line x1="100" y1="0" x2="100" y2="100" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
              <path d="M 10 80 L 100 80 L 180 0" fill="none" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <text x="180" y="20" fontSize="12" fill="#a855f7" fontWeight="bold">y = x</text>
              <text x="40" y="70" fontSize="12" fill="#a855f7" fontWeight="bold">y = 0</text>
            </svg>
          </div>
        </div>

        {/* Pros/Cons */}
        <div className="grid grid-cols-2 gap-4 flex-1">
           <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl shadow-sm">
             <h4 className="text-emerald-800 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-1"><CheckCircle2 size={14}/> Advantages</h4>
             <ul className="text-[10px] text-emerald-700 space-y-1.5 list-disc ml-4">
               <li><strong>Efficient:</strong> Just a <code>max(0,x)</code> call.</li>
               <li><strong>Better Gradients:</strong> Gradient is exactly 1 for positive inputs, preventing vanishing gradients.</li>
               <li><strong>Sparsity:</strong> Negative inputs become strict 0s, resulting in lighter networks.</li>
             </ul>
           </div>
           <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl shadow-sm">
             <h4 className="text-rose-800 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-1"><AlertTriangle size={14}/> Disadvantages</h4>
             <ul className="text-[10px] text-rose-700 space-y-1.5 list-disc ml-4">
               <li><strong>Dying ReLU:</strong> If a neuron is pushed far into negative territory, it always outputs 0, its gradient becomes 0, and it never updates again (it "dies").</li>
               <li><strong>Not Zero-Centered:</strong> Output is always positive.</li>
             </ul>
           </div>
        </div>

      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner flex-1 overflow-y-auto min-h-[300px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-[11px] text-slate-400 font-mono">Python Code</span></div>
          <pre className="whitespace-pre-wrap font-mono text-[11px] text-emerald-100 leading-relaxed">
{pyCode}
          </pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 overflow-y-auto max-h-[100px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} className="text-slate-400"/> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{outCode}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 3: Sigmoid & Tanh ---
function SigmoidTanhSlide() {
  const [view, setView] = useState('sigmoid'); // 'sigmoid' or 'tanh'

  const inputs = [-5.0, 0.0, 5.0];
  
  const pyCode = {
    'sigmoid': `import torch\nimport torch.nn as nn\n\nsigmoid_act = nn.Sigmoid()\n\nx = torch.tensor([-5.0, 0.0, 5.0])\ny = sigmoid_act(x)\n\nprint(f"Input: {x}")\nprint(f"Output after Sigmoid: {y}")`,
    'tanh': `import torch\nimport torch.nn as nn\n\ntanh_act = nn.Tanh()\n\nx = torch.tensor([-5.0, 0.0, 5.0])\ny = tanh_act(x)\n\nprint(f"Input: {x}")\nprint(f"Output after Tanh: {y}")`
  };

  const outCode = {
    'sigmoid': `Input: tensor([-5.,  0.,  5.])\nOutput after Sigmoid: tensor([0.0067, 0.5000, 0.9933])`,
    'tanh': `Input: tensor([-5.,  0.,  5.])\nOutput after Tanh: tensor([-0.9999,  0.0000,  0.9999])`
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2 h-full">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">S-Shaped Activations</h3>
        
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setView('sigmoid')}
            className={`flex-1 py-2 rounded-xl border-2 font-bold text-sm transition-all ${view === 'sigmoid' ? 'bg-purple-500 text-white border-purple-600 shadow' : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'}`}
          >
            Sigmoid
          </button>
          <button 
            onClick={() => setView('tanh')}
            className={`flex-1 py-2 rounded-xl border-2 font-bold text-sm transition-all ${view === 'tanh' ? 'bg-indigo-500 text-white border-indigo-600 shadow' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
          >
            Tanh
          </button>
        </div>

        {/* Visualizer */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center mb-6 shadow-sm relative min-h-[220px]">
          
          <div className="flex items-center gap-6 w-full justify-center mb-4 z-10 relative">
             <div className="flex flex-col gap-1">
               <span className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">Input</span>
               <div className="flex flex-col bg-white rounded border border-slate-300 shadow-sm">
                 {inputs.map((v, i) => (
                   <div key={`in${i}`} className="w-12 h-6 flex items-center justify-center font-mono text-[10px] border-b last:border-0 text-slate-600">{v.toFixed(1)}</div>
                 ))}
               </div>
             </div>

             <ArrowRight className="text-slate-300" size={24}/>

             <div className="flex flex-col gap-1">
               <span className={`text-[10px] font-bold text-center uppercase tracking-widest ${view === 'sigmoid' ? 'text-purple-600' : 'text-indigo-600'}`}>Output</span>
               <div className="flex flex-col bg-white rounded border border-slate-300 shadow-sm overflow-hidden">
                 {inputs.map((v, i) => {
                   let out = view === 'sigmoid' ? (1 / (1 + Math.exp(-v))) : Math.tanh(v);
                   return (
                     <div key={`out${i}`} className={`w-12 h-6 flex items-center justify-center font-mono text-[10px] font-bold border-b last:border-0 transition-colors duration-500 ${view === 'sigmoid' ? 'bg-purple-100 text-purple-900' : 'bg-indigo-100 text-indigo-900'}`}>
                       {out.toFixed(2)}
                     </div>
                   );
                 })}
               </div>
             </div>
          </div>

          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-30 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
               <line x1="0" y1="50" x2="100" y2="50" stroke="#000" strokeWidth="1" strokeDasharray="2"/>
               <line x1="50" y1="0" x2="50" y2="100" stroke="#000" strokeWidth="1" strokeDasharray="2"/>
               {view === 'sigmoid' ? (
                 <path d="M 0 95 C 40 95, 60 5, 100 5" fill="none" stroke="#a855f7" strokeWidth="4"/>
               ) : (
                 <path d="M 0 95 C 45 95, 55 5, 100 5" fill="none" stroke="#6366f1" strokeWidth="4"/>
               )}
            </svg>
          </div>

        </div>

        {/* Dynamic Details */}
        <div className="flex-1">
          {view === 'sigmoid' ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
              <p className="text-sm text-slate-700">Squashes inputs to a strict <strong>(0, 1)</strong> range. Historically popular, now mostly used for output layers outputting probabilities.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">Pros</span>
                  <span className="text-xs text-emerald-700">Perfect for representing probabilities. Smooth gradients.</span>
                </div>
                <div className="bg-rose-50 p-3 rounded-lg border border-rose-200">
                  <span className="text-[10px] font-bold text-rose-800 uppercase block mb-1">Cons</span>
                  <span className="text-xs text-rose-700"><strong>Vanishing Gradient!</strong> Saturates at extremes. Not zero-centered.</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <p className="text-sm text-slate-700">Squashes inputs to a <strong>(-1, 1)</strong> range. It is basically a shifted and scaled Sigmoid.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">Pros</span>
                  <span className="text-xs text-emerald-700"><strong>Zero-centered!</strong> Usually converges faster than Sigmoid in hidden layers.</span>
                </div>
                <div className="bg-rose-50 p-3 rounded-lg border border-rose-200">
                  <span className="text-[10px] font-bold text-rose-800 uppercase block mb-1">Cons</span>
                  <span className="text-xs text-rose-700"><strong>Vanishing Gradient!</strong> Still saturates at large inputs. Exp is computationally expensive.</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner flex-1 overflow-y-auto min-h-[250px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-[11px] text-slate-400 font-mono">Python Code</span></div>
          <pre className="whitespace-pre-wrap font-mono text-[11px] text-emerald-100 leading-relaxed">
{pyCode[view]}
          </pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 overflow-y-auto max-h-[150px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} className="text-slate-400"/> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{outCode[view]}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 4: Choosing ---
function ChoosingSlide() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Choosing an Activation Function</h3>
        <p className="text-slate-600 text-sm">
          There is no single "best" function for every task, but there are strong industry standards and guidelines based on the architecture and the specific layer's goal.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 flex-1">
        
        {/* ReLU */}
        <div className="bg-white border-2 border-purple-200 rounded-xl p-5 shadow-sm hover:border-purple-400 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-bold text-purple-900 text-lg">ReLU</h4>
            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">The Default</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Almost always use this as your default starting point for <strong>Hidden Layers</strong> in feed-forward networks (MLPs) and Convolutional Neural Networks (CNNs). It is fast and prevents vanishing gradients for positive values.
          </p>
        </div>

        {/* Leaky ReLU */}
        <div className="bg-white border-2 border-indigo-200 rounded-xl p-5 shadow-sm hover:border-indigo-400 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-bold text-indigo-900 text-lg">Leaky ReLU / PReLU</h4>
            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">The Fixer</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Swap to this if your network stops learning and you suspect the <strong>"Dying ReLU"</strong> problem. It introduces a tiny, non-zero slope for negative inputs so gradients can still flow.
          </p>
        </div>

        {/* Sigmoid */}
        <div className="bg-white border-2 border-emerald-200 rounded-xl p-5 shadow-sm hover:border-emerald-400 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-bold text-emerald-900 text-lg">Sigmoid</h4>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">The Output</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Generally avoid in deep hidden layers due to severe vanishing gradients. Reserve it strictly for the <strong>Output Layer</strong> when you need a probability between 0 and 1 (e.g., Binary Classification).
          </p>
        </div>

        {/* Tanh */}
        <div className="bg-white border-2 border-amber-200 rounded-xl p-5 shadow-sm hover:border-amber-400 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-bold text-amber-900 text-lg">Tanh</h4>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">The RNN Standard</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Can be effective in hidden layers where <strong>zero-centered</strong> data is helpful. It is historically the standard activation function used internally inside Recurrent Neural Networks (RNNs and LSTMs).
          </p>
        </div>

      </div>

      <div className="mt-6 bg-slate-900 p-4 rounded-xl flex items-start gap-4 shadow-inner">
         <Info className="flex-shrink-0 mt-0.5 text-purple-400" />
         <div>
           <h4 className="text-sm font-bold text-purple-300 mb-1">Experimentation is Key</h4>
           <p className="text-xs text-slate-400 leading-relaxed">
             In PyTorch, swapping activation functions is incredibly easy—usually just changing one line in your <code>__init__</code> method (e.g., changing <code>nn.ReLU()</code> to <code>nn.LeakyReLU()</code>). Don't be afraid to experiment if your model isn't converging!
           </p>
         </div>
      </div>

    </div>
  );
}