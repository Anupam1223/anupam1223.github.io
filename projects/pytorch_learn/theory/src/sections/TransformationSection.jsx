import React, { useState, useEffect } from 'react';
import { 
  Wand2, ChevronLeft, ChevronRight, Code, Terminal, 
  Image as ImageIcon, RefreshCcw, Maximize, Crop, 
  Palette, Sun, CheckCircle2, Layers, ArrowRight, Pointer,
  Brain, ShieldCheck, Binary, AlertTriangle, XCircle
} from 'lucide-react';

export default function TransformsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'why', title: 'Why Transform Data?', component: WhyTransformSlide },
    { id: 'preprocessing', title: 'Preprocessing Transforms', component: PreprocessingSlide },
    { id: 'augmentation', title: 'Data Augmentation', component: AugmentationSlide },
    { id: 'compose', title: 'Composing Pipelines', component: ComposeSlide },
    { id: 'integration', title: 'Dataset Integration', component: IntegrationSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Wand2 size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Data Transformations (torchvision.transforms)</h2>
        <p className="text-slate-400 text-sm mb-4">Standardizing inputs and augmenting data to prevent overfitting</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2 flex-wrap">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 min-w-[30px] rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-fuchsia-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase overflow-hidden">
          {slides.map((slide, idx) => (
            <span key={idx} className={`whitespace-nowrap ${idx === currentSlide ? 'text-fuchsia-400 font-bold' : 'hidden md:inline'}`}>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-fuchsia-600 text-white hover:bg-fuchsia-700 disabled:opacity-50 font-semibold transition-colors"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}

// --- Slide 1: Why Transform Data? (NEW) ---
function WhyTransformSlide() {
  const [view, setView] = useState('format'); // 'format' or 'augment'
  const [simStep, setSimStep] = useState(0);

  useEffect(() => {
    let timer;
    if (view === 'augment') {
      timer = setInterval(() => {
        setSimStep(s => (s + 1) % 3);
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [view]);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <h3 className="text-xl font-bold mb-4">Why Do We Transform Data?</h3>
      <p className="text-slate-600 mb-6 leading-relaxed text-sm">
        "Transforming" data is a blanket term for two completely different goals. First, we must transform data into a format the math can understand. Second, we transform data to make our models smarter and more robust.
      </p>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setView('format')}
          className={`flex-1 py-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${view === 'format' ? 'bg-fuchsia-50 border-fuchsia-500 text-fuchsia-900 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
        >
          <Binary size={24} className={view === 'format' ? 'text-fuchsia-600' : 'text-slate-400'}/>
          <span className="font-bold text-sm">1. Mathematical Formatting</span>
          <span className="text-[10px] uppercase tracking-wider text-center">Required for the model to run</span>
        </button>

        <button 
          onClick={() => { setView('augment'); setSimStep(0); }}
          className={`flex-1 py-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${view === 'augment' ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
        >
          <ShieldCheck size={24} className={view === 'augment' ? 'text-indigo-600' : 'text-slate-400'}/>
          <span className="font-bold text-sm">2. Model Generalization</span>
          <span className="text-[10px] uppercase tracking-wider text-center">Prevents Memorization (Overfitting)</span>
        </button>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col items-center justify-center flex-1 relative min-h-[300px] overflow-hidden">
        
        {view === 'format' ? (
          <div className="w-full flex flex-col items-center animate-in zoom-in-95">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">The Formatting Problem</h4>
            
            <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-center">
               
               {/* Wrong Way */}
               <div className="flex flex-col items-center gap-2 opacity-50 grayscale">
                 <div className="bg-white p-2 border-2 border-slate-300 rounded shadow-sm flex flex-col items-center">
                   <ImageIcon size={32} className="text-slate-500 mb-1"/>
                   <span className="text-[10px] font-bold">JPEG Image</span>
                   <span className="text-[8px]">800x600 pixels</span>
                 </div>
                 <ArrowRight size={20} className="text-slate-400"/>
                 <div className="bg-slate-800 text-white p-3 rounded-lg flex flex-col items-center shadow-lg relative">
                   <Brain size={24} className="mb-1"/>
                   <span className="text-[10px] font-bold">Neural Net</span>
                   <div className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full"><XCircle size={16}/></div>
                 </div>
                 <span className="text-[10px] text-rose-600 font-bold mt-2 text-center">Error: Model only<br/>understands numbers!</span>
               </div>

               <div className="hidden md:block w-px h-32 bg-slate-300 mx-4"></div>
               <div className="md:hidden h-px w-full bg-slate-300 my-4"></div>

               {/* Right Way */}
               <div className="flex flex-col items-center gap-2">
                 <div className="bg-white p-2 border-2 border-slate-300 rounded shadow-sm flex flex-col items-center">
                   <ImageIcon size={32} className="text-fuchsia-500 mb-1"/>
                   <span className="text-[10px] font-bold">JPEG Image</span>
                 </div>
                 <ArrowRight size={20} className="text-fuchsia-400"/>
                 <div className="bg-fuchsia-100 border-2 border-fuchsia-400 text-fuchsia-900 p-2 rounded-lg flex flex-col items-center shadow-sm">
                   <span className="text-[10px] font-bold uppercase tracking-widest mb-1">Preprocessing</span>
                   <span className="text-xs font-mono bg-white px-2 rounded mb-1">Resize(224)</span>
                   <span className="text-xs font-mono bg-white px-2 rounded">ToTensor()</span>
                 </div>
                 <ArrowRight size={20} className="text-fuchsia-400"/>
                 <div className="bg-slate-800 text-white p-3 rounded-lg flex flex-col items-center shadow-lg relative ring-2 ring-emerald-400">
                   <Brain size={24} className="mb-1 text-emerald-400"/>
                   <span className="text-[10px] font-bold">Neural Net</span>
                   <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full"><CheckCircle2 size={16}/></div>
                 </div>
                 <span className="text-[10px] text-emerald-600 font-bold mt-2 text-center">Success: Input is a <br/>[3, 224, 224] Tensor!</span>
               </div>

            </div>

            <p className="mt-8 text-xs text-fuchsia-800 bg-fuchsia-100 px-4 py-2 border border-fuchsia-200 rounded text-center max-w-lg leading-relaxed">
              <strong>Preprocessing</strong> guarantees that raw data is converted into perfectly sized, mathematically normalized Tensors. If the input layer expects exactly 224 pixels, a 225-pixel image will crash the program.
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center animate-in zoom-in-95">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">The Overfitting Simulator</h4>
            
            <div className="grid md:grid-cols-2 gap-8 w-full max-w-2xl">
               
               {/* Without Augmentation */}
               <div className="bg-white border border-slate-200 rounded-xl p-4 shadow flex flex-col items-center">
                 <h5 className="font-bold text-rose-800 text-sm mb-4 flex items-center gap-2"><AlertTriangle size={16}/> Without Augmentation</h5>
                 <div className="relative w-24 h-24 bg-sky-200 border-4 border-slate-700 rounded-lg overflow-hidden mb-4">
                    <Sun size={40} className="absolute top-2 right-2 text-yellow-500" fill="currentColor"/>
                    <div className="w-full h-1/2 bg-emerald-500 absolute bottom-0"></div>
                 </div>
                 <div className="bg-rose-50 border border-rose-200 p-2 rounded w-full text-center">
                   <span className="text-[10px] text-rose-600 font-bold uppercase block mb-1">Epoch {simStep + 1} Result:</span>
                   <span className="text-xs font-mono text-slate-700">"I memorized the exact pixel layout. The sun is ALWAYS at coordinates (x:18, y:4)."</span>
                 </div>
               </div>

               {/* With Augmentation */}
               <div className="bg-white border border-slate-200 rounded-xl p-4 shadow flex flex-col items-center">
                 <h5 className="font-bold text-emerald-800 text-sm mb-4 flex items-center gap-2"><Wand2 size={16}/> With Augmentation</h5>
                 <div className="relative w-24 h-24 border-4 border-slate-700 rounded-lg overflow-hidden mb-4 flex items-center justify-center bg-slate-100">
                    <div 
                      className="absolute inset-0 bg-sky-200 transition-all duration-700 ease-in-out"
                      style={{
                        transform: simStep === 0 ? 'scale(1)' : simStep === 1 ? 'scale(-1, 1)' : 'scale(1.2) rotate(10deg)',
                        filter: simStep === 2 ? 'hue-rotate(45deg)' : 'none'
                      }}
                    >
                      <Sun size={40} className="absolute top-2 right-2 text-yellow-500" fill="currentColor"/>
                      <div className="w-full h-1/2 bg-emerald-500 absolute bottom-0"></div>
                    </div>
                 </div>
                 <div className="bg-emerald-50 border border-emerald-200 p-2 rounded w-full text-center">
                   <span className="text-[10px] text-emerald-600 font-bold uppercase block mb-1">Epoch {simStep + 1} Result:</span>
                   <span className="text-xs font-mono text-slate-700">"The image keeps changing! I must learn the abstract features of a 'sun' and 'grass' instead."</span>
                 </div>
               </div>

            </div>

            <p className="mt-6 text-xs text-indigo-800 bg-indigo-100 px-4 py-2 border border-indigo-200 rounded text-center max-w-lg leading-relaxed">
              <strong>Data Augmentation</strong> acts as a multiplier. By randomly altering the training images every epoch, we artificially create infinite variations. This stops the model from memorizing the data, forcing it to generalize.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Slide 2: Preprocessing ---
function PreprocessingSlide() {
  const [step, setStep] = useState(0);

  const explanations = [
    <span><strong>Raw Image:</strong> Loaded from disk via PIL. It has arbitrary dimensions (e.g., 500x300) and pixel values from 0-255.</span>,
    <span><strong>Resize(256):</strong> Scales the image so its smaller edge is 256 pixels, preserving the aspect ratio. Essential for networks expecting fixed sizes.</span>,
    <span><strong>CenterCrop(224):</strong> Crops a perfect 224x224 square from the exact center of the resized image. The shape is now standardized.</span>,
    <span><strong>ToTensor():</strong> Converts the PIL Image (H x W x C) into a PyTorch Tensor (C x H x W). Crucially, it scales the 0-255 pixel values down to <strong>[0.0, 1.0]</strong>.</span>,
    <span><strong>Normalize(mean, std):</strong> Shifts the tensor values using predefined stats (like ImageNet's). <code>out = (input - mean) / std</code>. This centers data around zero, speeding up training convergence.</span>
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <h3 className="text-xl font-bold mb-2">Common Preprocessing Transforms</h3>
      <p className="text-slate-600 mb-6 leading-relaxed text-sm">
        These standardizing transforms are typically applied to <strong>all</strong> dataset splits (training, validation, and testing) to ensure absolute format consistency.
      </p>

      <div className="grid md:grid-cols-[1fr_1.5fr] gap-6 flex-1">
        
        {/* Navigation & Text */}
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <button onClick={() => setStep(0)} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center gap-3 transition-all ${step === 0 ? 'bg-fuchsia-50 border-fuchsia-500 text-fuchsia-900 font-bold' : 'bg-white text-slate-600 border-slate-200 hover:border-fuchsia-300'}`}><ImageIcon size={16}/> 1. Original Image</button>
            <button onClick={() => setStep(1)} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center gap-3 transition-all ${step === 1 ? 'bg-fuchsia-50 border-fuchsia-500 text-fuchsia-900 font-bold' : 'bg-white text-slate-600 border-slate-200 hover:border-fuchsia-300'}`}><Maximize size={16}/> 2. transforms.Resize(256)</button>
            <button onClick={() => setStep(2)} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center gap-3 transition-all ${step === 2 ? 'bg-fuchsia-50 border-fuchsia-500 text-fuchsia-900 font-bold' : 'bg-white text-slate-600 border-slate-200 hover:border-fuchsia-300'}`}><Crop size={16}/> 3. transforms.CenterCrop(224)</button>
            <button onClick={() => setStep(3)} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center gap-3 transition-all ${step === 3 ? 'bg-fuchsia-50 border-fuchsia-500 text-fuchsia-900 font-bold' : 'bg-white text-slate-600 border-slate-200 hover:border-fuchsia-300'}`}><Code size={16}/> 4. transforms.ToTensor()</button>
            <button onClick={() => setStep(4)} className={`w-full text-left px-4 py-2 rounded-xl border-2 flex items-center gap-3 transition-all ${step === 4 ? 'bg-fuchsia-50 border-fuchsia-500 text-fuchsia-900 font-bold' : 'bg-white text-slate-600 border-slate-200 hover:border-fuchsia-300'}`}><Wand2 size={16}/> 5. transforms.Normalize(...)</button>
          </div>

          <div className="bg-fuchsia-50 border border-fuchsia-200 p-4 rounded-xl shadow-sm min-h-[130px] flex items-center text-sm text-fuchsia-900 leading-relaxed transition-all">
            {explanations[step]}
          </div>
        </div>

        {/* Visualizer */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
           <div className="relative w-[300px] h-[300px] flex items-center justify-center">
              
              {/* Step 0: Original */}
              <div className={`absolute flex items-center justify-center bg-emerald-200 border-4 border-slate-700 overflow-hidden transition-all duration-700 ease-in-out ${step === 0 ? 'w-[280px] h-[160px] opacity-100 scale-100' : 'w-[256px] h-[256px] opacity-0 scale-90 pointer-events-none'}`}>
                 <Sun size={64} className="text-yellow-500 absolute top-4 right-4" fill="currentColor"/>
                 <div className="w-full h-1/2 bg-emerald-500 absolute bottom-0"></div>
                 <span className="z-10 font-bold text-slate-800 bg-white/70 px-2 py-1 rounded">PIL Image (500x300)</span>
              </div>

              {/* Step 1: Resize */}
              <div className={`absolute flex items-center justify-center bg-emerald-200 border-4 border-slate-700 overflow-hidden transition-all duration-700 ease-in-out ${step === 1 ? 'w-[256px] h-[256px] opacity-100 scale-100' : 'w-[224px] h-[224px] opacity-0 scale-95 pointer-events-none'}`}>
                 <Sun size={64} className="text-yellow-500 absolute top-4 right-4" fill="currentColor"/>
                 <div className="w-full h-1/2 bg-emerald-500 absolute bottom-0"></div>
                 <span className="z-10 font-bold text-slate-800 bg-white/70 px-2 py-1 rounded">Resized (256x256)</span>
              </div>

              {/* Step 2: CenterCrop */}
              <div className={`absolute flex items-center justify-center bg-emerald-200 border-4 border-rose-500 overflow-hidden transition-all duration-700 ease-in-out ${step === 2 ? 'w-[224px] h-[224px] opacity-100 scale-100' : 'w-[224px] h-[224px] opacity-0 scale-95 pointer-events-none'}`}>
                 <Sun size={80} className="text-yellow-500 absolute -top-2 -right-2" fill="currentColor"/>
                 <div className="w-full h-1/2 bg-emerald-500 absolute bottom-0"></div>
                 <span className="z-10 font-bold text-rose-800 bg-white/90 px-2 py-1 rounded shadow-md">Cropped (224x224)</span>
                 <div className="absolute inset-0 border-4 border-rose-500 border-dashed animate-pulse"></div>
              </div>

              {/* Step 3: ToTensor */}
              <div className={`absolute flex items-center justify-center bg-blue-100 border-4 border-blue-500 overflow-hidden transition-all duration-700 ease-in-out ${step === 3 ? 'w-[224px] h-[224px] opacity-100 scale-100' : 'w-[224px] h-[224px] opacity-0 scale-95 pointer-events-none'}`}>
                 <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                 <div className="z-10 flex flex-col items-center gap-2">
                   <span className="font-bold text-blue-900 bg-white/90 px-2 py-1 rounded shadow-md">Tensor [3, 224, 224]</span>
                   <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">Values: [0.0 - 1.0]</span>
                 </div>
              </div>

              {/* Step 4: Normalize */}
              <div className={`absolute flex items-center justify-center bg-purple-100 border-4 border-purple-500 overflow-hidden transition-all duration-700 ease-in-out ${step === 4 ? 'w-[224px] h-[224px] opacity-100 scale-100' : 'w-[224px] h-[224px] opacity-0 scale-95 pointer-events-none'}`}>
                 <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#a855f7 1px, transparent 1px), linear-gradient(90deg, #a855f7 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                 <div className="z-10 flex flex-col items-center gap-2 text-center">
                   <span className="font-bold text-purple-900 bg-white/90 px-2 py-1 rounded shadow-md">Normalized Tensor</span>
                   <span className="font-mono text-[10px] text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-200 block max-w-[180px]">
                     Mean: ~0.0 <br/>
                     Std: ~1.0 <br/>
                     Values: ~[-2.0, +2.0]
                   </span>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}

// --- Slide 3: Data Augmentation Engine ---
function AugmentationSlide() {
  const [activeTransforms, setActiveTransforms] = useState({
    flip: false,
    rotate: false,
    color: false,
    crop: false
  });

  const toggleTransform = (key) => {
    setActiveTransforms(prev => ({...prev, [key]: !prev[key]}));
  };

  // Build the CSS transform string dynamically based on toggles
  let transformStr = '';
  if (activeTransforms.flip) transformStr += 'scaleX(-1) ';
  if (activeTransforms.rotate) transformStr += 'rotate(15deg) ';
  if (activeTransforms.crop) transformStr += 'scale(1.3) translate(10%, 10%) ';

  let filterStr = '';
  if (activeTransforms.color) filterStr += 'hue-rotate(90deg) saturate(150%) brightness(1.2) ';

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Data Augmentation Engine</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          Applied <strong>only to the training set</strong>, augmentations introduce randomness. This prevents the model from memorizing exact pixel layouts. Toggle the transforms below to see how they modify the image!
        </p>
      </div>

      <div className="grid md:grid-cols-[1.2fr_1fr] gap-6 flex-1">
        
        {/* Toggle Controls */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => toggleTransform('flip')}
            className={`p-4 rounded-xl border-2 flex flex-col items-start transition-all ${activeTransforms.flip ? 'bg-fuchsia-50 border-fuchsia-500 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className={`font-bold font-mono text-sm ${activeTransforms.flip ? 'text-fuchsia-900' : 'text-slate-700'}`}>RandomHorizontalFlip(p=0.5)</span>
              <RefreshCcw size={16} className={`${activeTransforms.flip ? 'text-fuchsia-600' : 'text-slate-400'}`}/>
            </div>
            <span className="text-xs text-slate-500 text-left">50% chance to flip the image left-to-right.</span>
          </button>

          <button 
            onClick={() => toggleTransform('rotate')}
            className={`p-4 rounded-xl border-2 flex flex-col items-start transition-all ${activeTransforms.rotate ? 'bg-fuchsia-50 border-fuchsia-500 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className={`font-bold font-mono text-sm ${activeTransforms.rotate ? 'text-fuchsia-900' : 'text-slate-700'}`}>RandomRotation(degrees)</span>
              <RefreshCcw size={16} className={`${activeTransforms.rotate ? 'text-fuchsia-600' : 'text-slate-400'}`}/>
            </div>
            <span className="text-xs text-slate-500 text-left">Randomly tilts the image within a defined angle range.</span>
          </button>

          <button 
            onClick={() => toggleTransform('color')}
            className={`p-4 rounded-xl border-2 flex flex-col items-start transition-all ${activeTransforms.color ? 'bg-fuchsia-50 border-fuchsia-500 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className={`font-bold font-mono text-sm ${activeTransforms.color ? 'text-fuchsia-900' : 'text-slate-700'}`}>ColorJitter(...)</span>
              <Palette size={16} className={`${activeTransforms.color ? 'text-fuchsia-600' : 'text-slate-400'}`}/>
            </div>
            <span className="text-xs text-slate-500 text-left">Randomly alters brightness, contrast, saturation, and hue.</span>
          </button>

          <button 
            onClick={() => toggleTransform('crop')}
            className={`p-4 rounded-xl border-2 flex flex-col items-start transition-all ${activeTransforms.crop ? 'bg-fuchsia-50 border-fuchsia-500 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className={`font-bold font-mono text-sm ${activeTransforms.crop ? 'text-fuchsia-900' : 'text-slate-700'}`}>RandomResizedCrop(size)</span>
              <Crop size={16} className={`${activeTransforms.crop ? 'text-fuchsia-600' : 'text-slate-400'}`}/>
            </div>
            <span className="text-xs text-slate-500 text-left">Crops a random patch and resizes it. Very common in CNNs!</span>
          </button>
        </div>

        {/* Interactive Visualizer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
           
           <div className="absolute top-4 left-4 z-20 flex gap-2">
             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-800 px-2 py-1 rounded">Simulation</span>
           </div>

           {/* The Image Container (Acts as the Viewport) */}
           <div className="w-[250px] h-[250px] border-4 border-slate-700 rounded-xl overflow-hidden relative shadow-2xl bg-slate-800">
             
             {/* The Actual "Image" being transformed */}
             <div 
               className="w-full h-full relative transition-all duration-700 ease-in-out bg-sky-400"
               style={{ transform: transformStr, filter: filterStr }}
             >
                {/* Sun */}
                <Sun size={80} className="absolute top-4 right-4 text-yellow-300" fill="currentColor" />
                {/* Cloud 1 */}
                <div className="absolute top-12 left-8 w-16 h-6 bg-white/80 rounded-full blur-[2px]"></div>
                {/* Grass */}
                <div className="absolute bottom-0 w-full h-[40%] bg-emerald-500 flex items-start justify-center pt-4">
                   {/* House */}
                   <div className="relative w-20 h-20 bg-amber-700 border-2 border-amber-900">
                     <div className="absolute -top-10 -left-2 w-0 h-0 border-l-[44px] border-r-[44px] border-b-[40px] border-l-transparent border-r-transparent border-b-rose-700"></div>
                     <div className="absolute bottom-0 left-6 w-6 h-10 bg-amber-900"></div>
                   </div>
                </div>
             </div>
             
           </div>

        </div>

      </div>
    </div>
  );
}

// --- Slide 4: Compose Pipelines ---
function ComposeSlide() {
  const pyCode = `import torchvision.transforms as transforms

# Example transform pipeline for TRAINING
train_transform = transforms.Compose([
    transforms.Resize(256),             # Resize smaller edge to 256
    transforms.RandomCrop(224),         # Randomly crop a 224x224 patch
    transforms.RandomHorizontalFlip(),  # Randomly flip horizontally
    transforms.ToTensor(),              # Convert PIL Image to tensor (0-1 range)
    transforms.Normalize(               # Normalize with ImageNet stats
        mean=[0.485, 0.456, 0.406], 
        std=[0.229, 0.224, 0.225]
    )
])

# Example transform pipeline for VALIDATION/TESTING
# Notice: NO random augmentations here!
test_transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),         # Deterministic center crop
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])`;

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Composing Pipelines</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          You rarely apply just one transform. <code>transforms.Compose</code> allows you to chain a list of objects together sequentially. 
          <br/><br/>
          <strong>Crucial Concept:</strong> You must create separate pipelines for Training and Testing. Testing should be deterministic (no random flips or crops).
        </p>

        <div className="flex flex-col gap-4 flex-1">
           {/* Train Pipeline Flow */}
           <div className="bg-fuchsia-50 border-2 border-fuchsia-200 p-4 rounded-xl shadow-sm relative">
             <span className="absolute -top-3 left-4 bg-fuchsia-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow">Training Pipeline</span>
             <div className="flex flex-wrap gap-2 mt-2">
               <div className="bg-white border border-fuchsia-300 text-fuchsia-800 text-[10px] font-mono font-bold px-2 py-1 rounded">Resize</div><ArrowRight size={14} className="text-fuchsia-400 mt-1"/>
               <div className="bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-mono font-bold px-2 py-1 rounded shadow-sm ring-1 ring-amber-400">RandomCrop</div><ArrowRight size={14} className="text-fuchsia-400 mt-1"/>
               <div className="bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-mono font-bold px-2 py-1 rounded shadow-sm ring-1 ring-amber-400">RandomFlip</div><ArrowRight size={14} className="text-fuchsia-400 mt-1"/>
               <div className="bg-blue-100 border border-blue-300 text-blue-800 text-[10px] font-mono font-bold px-2 py-1 rounded">ToTensor</div><ArrowRight size={14} className="text-fuchsia-400 mt-1"/>
               <div className="bg-purple-100 border border-purple-300 text-purple-800 text-[10px] font-mono font-bold px-2 py-1 rounded">Normalize</div>
             </div>
           </div>

           {/* Test Pipeline Flow */}
           <div className="bg-slate-50 border-2 border-slate-300 p-4 rounded-xl shadow-sm relative mt-4">
             <span className="absolute -top-3 left-4 bg-slate-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow">Testing Pipeline</span>
             <div className="flex flex-wrap gap-2 mt-2">
               <div className="bg-white border border-slate-300 text-slate-700 text-[10px] font-mono font-bold px-2 py-1 rounded">Resize</div><ArrowRight size={14} className="text-slate-400 mt-1"/>
               <div className="bg-white border border-slate-300 text-slate-700 text-[10px] font-mono font-bold px-2 py-1 rounded">CenterCrop</div><ArrowRight size={14} className="text-slate-400 mt-1"/>
               <div className="bg-blue-100 border border-blue-300 text-blue-800 text-[10px] font-mono font-bold px-2 py-1 rounded">ToTensor</div><ArrowRight size={14} className="text-slate-400 mt-1"/>
               <div className="bg-purple-100 border border-purple-300 text-purple-800 text-[10px] font-mono font-bold px-2 py-1 rounded">Normalize</div>
             </div>
             <p className="text-[10px] text-slate-500 font-bold mt-3 border-t border-slate-200 pt-2"><CheckCircle2 size={12} className="inline text-emerald-500 mr-1"/> Strictly deterministic.</p>
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner flex-1 overflow-y-auto min-h-[350px]">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-[11px] text-slate-400 font-mono">Python Code</span></div>
          <pre className="whitespace-pre-wrap font-mono text-[11px] text-emerald-100 leading-relaxed overflow-x-auto">
{pyCode}
          </pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 5: Dataset Integration ---
function IntegrationSlide() {
  const pyCode = `# Option 1: Built-in Datasets (Like ImageFolder)
from torchvision.datasets import ImageFolder

train_dataset = ImageFolder(
    root="path/to/train_images", 
    transform=train_transform # Pass the compose object here!
)

# -----------------------------------------------------

# Option 2: Custom Dataset Class
from torch.utils.data import Dataset
from PIL import Image

class CustomImageDataset(Dataset):
    def __init__(self, image_paths, labels, transform=None):
        self.image_paths = image_paths
        self.labels = labels
        self.transform = transform # Store the pipeline

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        # 1. Load raw image
        image = Image.open(self.image_paths[idx]).convert("RGB")
        label = self.labels[idx]

        # 2. Apply transformations if they exist
        if self.transform:
            image = self.transform(image) 

        # Return the fully transformed tensor!
        return image, label`;

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Integrating Transforms with Datasets</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Transform pipelines are executed inside the <code>Dataset</code> class. They are usually passed as an argument during instantiation and explicitly called inside the <code>__getitem__</code> method right after the raw file is loaded.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center flex-1 relative overflow-hidden min-h-[250px]">
          
          <h4 className="absolute top-4 left-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Inside __getitem__</h4>

          <div className="w-full flex flex-col gap-4 relative z-10 mt-6">
            
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded flex items-center justify-center border border-amber-300 shadow-sm shrink-0"><ImageIcon size={20}/></div>
               <div className="flex-1 bg-white border border-slate-200 p-2 rounded shadow-sm">
                 <span className="font-mono text-xs font-bold text-slate-700 block">image = Image.open(...)</span>
               </div>
            </div>

            <div className="flex flex-col items-center py-2">
               <ArrowRight size={20} className="text-slate-300 rotate-90" />
               <div className="bg-fuchsia-100 text-fuchsia-800 text-[10px] font-bold font-mono px-2 py-1 rounded border border-fuchsia-300 shadow-sm my-2 z-10 relative">
                  <div className="absolute -left-20 top-1 text-[8px] text-slate-400 uppercase">if transform:</div>
                  image = self.transform(image)
               </div>
               <ArrowRight size={20} className="text-slate-300 rotate-90" />
            </div>

            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded flex items-center justify-center border border-blue-300 shadow-sm shrink-0"><Layers size={20}/></div>
               <div className="flex-1 bg-white border border-slate-200 p-2 rounded shadow-sm">
                 <span className="font-mono text-xs font-bold text-blue-700 block">return image, label</span>
                 <p className="text-[9px] text-slate-500 mt-1">Image is now a perfectly augmented & normalized PyTorch Tensor!</p>
               </div>
            </div>

          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner flex-1 overflow-y-auto min-h-[350px]">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-[11px] text-slate-400 font-mono">Python Code</span></div>
          <pre className="whitespace-pre-wrap font-mono text-[11px] text-emerald-100 leading-relaxed overflow-x-auto">
{pyCode}
          </pre>
        </div>
      </div>
    </div>
  );
}