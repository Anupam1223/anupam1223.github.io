import React, { useState, useEffect } from 'react';
import { 
  Database, ChevronLeft, ChevronRight, Code, Terminal, 
  FileSpreadsheet, Image as ImageIcon, ArrowRight, PlayCircle, 
  CheckCircle2, HardDrive, PackageOpen, FileDigit, Pointer,
  Save, Ruler, Download
} from 'lucide-react';

export default function DatasetSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'contract', title: 'The Dataset Contract', component: ContractSlide },
    { id: 'simple', title: 'Simple Array Dataset', component: SimpleDatasetSlide },
    { id: 'complex', title: 'Lazy Loading Images (CSV)', component: ImageDatasetSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Database size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Working with torch.utils.data.Dataset</h2>
        <p className="text-slate-400 text-sm mb-4">Standardizing data access for deep learning models</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2 flex-wrap">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 min-w-[30px] rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-indigo-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase overflow-hidden">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-indigo-400 whitespace-nowrap' : 'hidden md:inline whitespace-nowrap'}>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 font-semibold transition-colors"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}

// --- Slide 1: The Dataset Contract ---
function ContractSlide() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">The Dataset Abstract Class</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          Think of <code>torch.utils.data.Dataset</code> as a <strong>contract</strong>. It defines a standard interface for accessing your data, ensuring that regardless of whether it resides in memory, on disk, or is generated on the fly, PyTorch knows exactly how to interact with it.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_1.5fr] gap-6 flex-1">
        
        {/* Core Methods Explanation */}
        <div className="flex flex-col gap-4">
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold flex items-center gap-2 text-indigo-900 mb-2 border-b border-indigo-200 pb-2">
              <FileDigit size={20} className="text-indigo-600"/> __len__(self)
            </h4>
            <p className="text-sm text-indigo-800 leading-relaxed mb-3">
              Must return the <strong>total number of samples</strong> in your dataset. The <code>DataLoader</code> relies on this to determine the size of an epoch and when to stop requesting batches.
            </p>
            <code className="block bg-white border border-indigo-100 p-2 rounded text-xs text-indigo-600 font-bold">return len(self.features)</code>
          </div>

          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold flex items-center gap-2 text-emerald-900 mb-2 border-b border-emerald-200 pb-2">
              <PackageOpen size={20} className="text-emerald-600"/> __getitem__(self, idx)
            </h4>
            <p className="text-sm text-emerald-800 leading-relaxed mb-3">
              Must load and return a <strong>single sample</strong> given an index <code>idx</code>. This is where the actual data loading logic resides (e.g., reading a file, grabbing an array row).
            </p>
            <code className="block bg-white border border-emerald-100 p-2 rounded text-xs text-emerald-600 font-bold">return feature_tensor, label_tensor</code>
          </div>
        </div>

        {/* Visual Contract Representation */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col items-center justify-center relative min-h-[300px]">
          
          <h4 className="absolute top-4 left-6 text-xs font-bold text-slate-400 uppercase tracking-widest">The API Contract</h4>

          <div className="w-full max-w-sm flex flex-col gap-6 relative z-10 mt-6">
            
            {/* The Dataloader Request */}
            <div className="flex justify-between items-center bg-slate-800 text-white p-3 rounded-xl shadow-md border-2 border-slate-700">
               <span className="font-bold text-sm">PyTorch DataLoader</span>
               <span className="text-xs font-mono bg-slate-700 px-2 py-1 rounded">"Get index 42"</span>
            </div>

            {/* The Dataset Wrapper */}
            <div className="border-4 border-dashed border-indigo-300 rounded-xl p-4 bg-indigo-50/50 flex flex-col items-center gap-4 relative">
               <span className="absolute -top-3 bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-200">CustomDataset</span>
               
               <div className="bg-white border-2 border-emerald-400 p-3 rounded-lg shadow-sm w-full text-center">
                 <span className="font-mono font-bold text-emerald-700">__getitem__(42)</span>
                 <p className="text-[10px] text-slate-500 mt-1">Locates and loads 42nd item...</p>
               </div>
               
               <ArrowRight size={24} className="text-indigo-300 rotate-90" />
               
               <div className="bg-white border-2 border-blue-400 p-3 rounded-lg shadow-sm w-full flex items-center justify-between">
                 <span className="text-[10px] font-bold text-slate-400 uppercase">Returns Tuple</span>
                 <span className="font-mono font-bold text-blue-700 text-sm">(Tensor, Tensor)</span>
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// --- Slide 2: Simple Custom Dataset ---
function SimpleDatasetSlide() {
  const [view, setView] = useState('init');
  const [fetchIndex, setFetchIndex] = useState(null);

  const pyCode = `import torch\nfrom torch.utils.data import Dataset\nimport numpy as np\n\nclass SimpleCustomDataset(Dataset):\n    """A simple example dataset with features and labels."""\n\n    def __init__(self, features, labels):\n        """\n        Args:\n            features (list or np.array): A list or array of features.\n            labels (list or np.array): A list or array of labels.\n        """\n        # Basic check: Features and labels must have the same length\n        assert len(features) == len(labels), "Features and labels must have the same length."\n        self.features = features\n        self.labels = labels\n\n    def __len__(self):\n        """Returns the total number of samples."""\n        return len(self.features)\n\n    def __getitem__(self, idx):\n        """\n        Generates one sample of data.\n        Args:\n            idx (int): The index of the item.\n        Returns:\n            tuple: (feature, label) for the given index.\n        """\n        # Retrieve feature and label for the given index\n        feature = self.features[idx]\n        label = self.labels[idx]\n\n        # Often, you'll convert data to PyTorch tensors here\n        # We assume features/labels might not be tensors yet\n        sample = (torch.tensor(feature, dtype=torch.float32),\n                  torch.tensor(label, dtype=torch.long)) # Assuming classification label\n\n        return sample\n\n# --- Example Usage ---\n# Sample data (replace with your actual data)\nnum_samples = 100\nnum_features = 10\nfeatures_data = np.random.randn(num_samples, num_features)\nlabels_data = np.random.randint(0, 5, size=num_samples) # Example: 5 classes\n\n# Create an instance of the custom dataset\nmy_dataset = SimpleCustomDataset(features_data, labels_data)\n\n# Access dataset properties and elements\nprint(f"Dataset size: {len(my_dataset)}")\n\n# Get the first sample\nfirst_sample = my_dataset[0]\nfeature_sample, label_sample = first_sample\nprint(f"\\nFirst sample features:\\n{feature_sample}")\nprint(f"First sample shape: {feature_sample.shape}")\nprint(f"First sample label: {label_sample}")\n\n# Get the tenth sample\ntenth_sample = my_dataset[9]\nprint(f"\\nTenth sample label: {tenth_sample[1]}")`;

  const outCode = `Dataset size: 100\n\nFirst sample features:\ntensor([-0.1234,  1.4567, -0.9876,  0.5432, -1.1111,  0.2222,  1.3333, -0.4444,\n         0.5555, -0.6666])\nFirst sample shape: torch.Size([10])\nFirst sample label: 3\n\nTenth sample label: 1`;

  // Dummy mock data for visualizer
  const mockFeatures = [
    [0.1, -1.2, 0.4, '...'],
    [-0.5, 0.8, 1.1, '...'],
    [2.3, -0.1, 0.9, '...'],
    [0.0, 1.5, -2.1, '...']
  ];
  const mockLabels = [3, 0, 4, 1];

  const triggerFetch = (idx) => {
    setFetchIndex(null); 
    setTimeout(() => setFetchIndex(idx), 50); 
  };

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Anatomy of a Custom Dataset</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Let's break down the three required methods when inheriting from <code>torch.utils.data.Dataset</code>.
        </p>

        <div className="space-y-3 mb-6">
          <div 
            onClick={() => setView('init')}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${view === 'init' ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-slate-200 hover:border-indigo-300'}`}
          >
            <h4 className={`font-bold flex items-center gap-2 mb-2 ${view === 'init' ? 'text-indigo-900' : 'text-slate-700'}`}>
              <Save size={18} className={view === 'init' ? 'text-indigo-500' : 'text-slate-400'}/> __init__(self, ...)
            </h4>
            {view === 'init' && (
              <p className="text-xs text-indigo-800 leading-relaxed animate-in fade-in">
                The <code>__init__</code> method stores the feature and label data passed during instantiation. It sets up the internal state of the dataset object.
              </p>
            )}
          </div>

          <div 
            onClick={() => setView('len')}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${view === 'len' ? 'border-amber-500 bg-amber-50 shadow-md' : 'border-slate-200 hover:border-amber-300'}`}
          >
            <h4 className={`font-bold flex items-center gap-2 mb-2 ${view === 'len' ? 'text-amber-900' : 'text-slate-700'}`}>
              <Ruler size={18} className={view === 'len' ? 'text-amber-500' : 'text-slate-400'}/> __len__(self)
            </h4>
            {view === 'len' && (
              <p className="text-xs text-amber-800 leading-relaxed animate-in fade-in">
                Simply returns the length of the features list (which must be the same as the labels list). The DataLoader uses this to know how many total samples exist.
              </p>
            )}
          </div>

          <div 
            onClick={() => { setView('getitem'); if (fetchIndex === null) triggerFetch(0); }}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${view === 'getitem' ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-200 hover:border-emerald-300'}`}
          >
            <h4 className={`font-bold flex items-center gap-2 mb-2 ${view === 'getitem' ? 'text-emerald-900' : 'text-slate-700'}`}>
              <Download size={18} className={view === 'getitem' ? 'text-emerald-500' : 'text-slate-400'}/> __getitem__(self, idx)
            </h4>
            {view === 'getitem' && (
              <p className="text-xs text-emerald-800 leading-relaxed animate-in fade-in">
                Takes an index <code>idx</code>, retrieves the corresponding feature and label, converts them into PyTorch tensors, and returns them as a tuple. This conversion to tensors is standard practice here!
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        
        {/* Dynamic Visualizer Area */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden min-h-[280px]">
           {view === 'init' && (
             <div className="flex flex-col items-center w-full animate-in zoom-in-95 duration-500">
               <div className="flex gap-8 w-full justify-center mb-6">
                 <div className="bg-white p-3 border-2 border-slate-300 rounded shadow text-center w-32">
                   <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">NumPy Array</span>
                   <span className="font-mono text-sm font-bold text-slate-800">features_data</span>
                 </div>
                 <div className="bg-white p-3 border-2 border-slate-300 rounded shadow text-center w-32">
                   <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">NumPy Array</span>
                   <span className="font-mono text-sm font-bold text-slate-800">labels_data</span>
                 </div>
               </div>

               <div className="flex gap-20 w-full justify-center mb-4">
                 <ArrowRight size={24} className="text-indigo-400 rotate-90" />
                 <ArrowRight size={24} className="text-indigo-400 rotate-90" />
               </div>

               <div className="bg-indigo-100 border-2 border-indigo-400 p-6 rounded-xl shadow-md w-full max-w-sm relative text-center">
                 <span className="absolute top-2 left-4 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Instance State (self)</span>
                 <div className="flex justify-around mt-4">
                   <span className="font-mono font-bold text-indigo-900 bg-white px-3 py-1 rounded shadow-sm border border-indigo-200">self.features</span>
                   <span className="font-mono font-bold text-indigo-900 bg-white px-3 py-1 rounded shadow-sm border border-indigo-200">self.labels</span>
                 </div>
               </div>
             </div>
           )}

           {view === 'len' && (
             <div className="flex flex-col items-center w-full animate-in zoom-in-95 duration-500 relative">
               <div className="bg-white p-4 border-2 border-slate-300 rounded-xl shadow w-48 relative flex flex-col gap-2">
                 {[...Array(4)].map((_, i) => (
                   <div key={i} className="h-6 bg-slate-100 border border-slate-200 rounded w-full"></div>
                 ))}
                 <div className="text-center font-bold text-slate-400">. . .</div>
                 <div className="h-6 bg-slate-100 border border-slate-200 rounded w-full"></div>

                 {/* The Ruler */}
                 <div className="absolute -right-6 top-0 bottom-0 w-2 border-y-2 border-r-2 border-amber-500 rounded-r opacity-80"></div>
                 <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap shadow-md z-10">
                   100 Rows
                 </div>
               </div>
               
               <ArrowRight size={24} className="text-amber-400 rotate-90 my-4" />
               
               <div className="bg-amber-100 border-2 border-amber-400 p-3 rounded-lg shadow text-center">
                 <span className="font-mono text-lg font-black text-amber-900">len(my_dataset) = 100</span>
               </div>
             </div>
           )}

           {view === 'getitem' && (
             <div className="flex flex-col w-full h-full animate-in fade-in duration-500">
               <div className="flex justify-center gap-2 mb-6">
                 {[0, 1, 2, 3].map(idx => (
                   <button 
                     key={idx}
                     onClick={() => triggerFetch(idx)}
                     className={`w-24 py-1.5 rounded-lg text-[10px] font-bold border-2 transition-all ${fetchIndex === idx ? 'bg-emerald-600 text-white border-emerald-700 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'}`}
                   >
                     my_dataset[{idx}]
                   </button>
                 ))}
               </div>

               <div className="flex gap-4 relative z-10 mb-6 justify-center">
                  <div className="flex flex-col gap-1 w-32">
                     <span className="text-[10px] font-bold text-slate-400 uppercase text-center mb-1">self.features</span>
                     {mockFeatures.map((row, i) => (
                       <div key={i} className={`flex items-center justify-center gap-0.5 p-1 rounded border transition-all duration-300 ${fetchIndex === i ? 'bg-blue-100 border-blue-400 shadow-sm scale-105 z-10' : 'bg-white border-slate-200 opacity-50'}`}>
                         <span className="text-[8px] text-slate-400 mr-1">{i}</span>
                         {row.map((v, j) => <div key={j} className="w-5 h-5 flex items-center justify-center font-mono text-[8px] bg-slate-100 text-slate-600 rounded">{v}</div>)}
                       </div>
                     ))}
                  </div>

                  <div className="w-16 flex flex-col gap-1">
                     <span className="text-[10px] font-bold text-slate-400 uppercase text-center mb-1">self.labels</span>
                     {mockLabels.map((lbl, i) => (
                       <div key={i} className={`flex items-center justify-center p-1 rounded border transition-all duration-300 h-[30px] ${fetchIndex === i ? 'bg-emerald-100 border-emerald-400 shadow-sm scale-105 z-10' : 'bg-white border-slate-200 opacity-50'}`}>
                         <span className="font-mono text-xs font-bold text-emerald-800">{lbl}</span>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="w-full border-t-2 border-dashed border-slate-300 pt-6 relative flex justify-center">
                  {fetchIndex !== null ? (
                    <div className="animate-in slide-in-from-top-4 fade-in duration-500 bg-indigo-50 border-2 border-indigo-400 p-3 rounded-xl shadow-lg flex items-center gap-3">
                       <div className="flex flex-col items-center">
                         <span className="text-[8px] font-bold text-indigo-500 uppercase mb-1">Tensor (Float32)</span>
                         <div className="flex gap-0.5">
                           {mockFeatures[fetchIndex].map((v, j) => <div key={j} className="w-6 h-6 flex items-center justify-center font-mono text-[9px] font-bold bg-white text-indigo-900 rounded shadow-sm border border-indigo-200">{v}</div>)}
                         </div>
                       </div>
                       <div className="text-lg font-bold text-indigo-300">,</div>
                       <div className="flex flex-col items-center">
                         <span className="text-[8px] font-bold text-emerald-600 uppercase mb-1">Tensor (Long)</span>
                         <div className="w-6 h-6 flex items-center justify-center font-mono text-xs font-bold bg-emerald-500 text-white rounded shadow-sm">
                           {mockLabels[fetchIndex]}
                         </div>
                       </div>
                    </div>
                  ) : (
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center w-full">
                      Click an index above
                    </div>
                  )}
               </div>
             </div>
           )}
        </div>

        {/* Code View */}
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[350px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-slate-400">Python Code</span></div>
          <pre className="whitespace-pre-wrap font-mono text-[11px] text-emerald-100 leading-relaxed overflow-x-auto">
{pyCode}
          </pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 overflow-y-auto max-h-[150px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} className="text-slate-400"/> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap overflow-x-auto">{outCode}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 3: Lazy Loading Images (CSV) ---
function ImageDatasetSlide() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let t1, t2, t3;
    if (step === 1) t1 = setTimeout(() => setStep(2), 1000); // Read CSV -> Find File
    if (step === 2) t2 = setTimeout(() => setStep(3), 1200); // Find File -> Load Image
    if (step === 3) t3 = setTimeout(() => setStep(4), 1200); // Load Image -> Tensor
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [step]);

  const pyCode = `import torch\nfrom torch.utils.data import Dataset\nfrom PIL import Image\nimport pandas as pd\nimport os\n\nclass ImageFilelistDataset(Dataset):\n    def __init__(self, csv_file, root_dir, transform=None):\n        # Load CSV into memory (paths only, NOT images!)\n        self.annotations = pd.read_csv(csv_file)\n        self.root_dir = root_dir\n        self.transform = transform\n\n    def __len__(self):\n        return len(self.annotations)\n\n    def __getitem__(self, idx):\n        # 1. Get relative path and label from CSV\n        img_rel_path = self.annotations.iloc[idx, 0]\n        img_full_path = os.path.join(self.root_dir, img_rel_path)\n        \n        label = self.annotations.iloc[idx, 1]\n        label = torch.tensor(int(label), dtype=torch.long)\n\n        # 2. Lazy Load the image from disk using PIL\n        image = Image.open(img_full_path).convert('RGB')\n\n        # 3. Apply transformations (e.g., to Tensor, resize)\n        if self.transform:\n            image = self.transform(image)\n\n        return image, label`;

  const triggerFlow = () => {
    setStep(0);
    setTimeout(() => setStep(1), 50);
  };

  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Handling Complex Scenarios: Lazy Loading</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          The real utility of <code>Dataset</code> is dealing with massive data. Instead of loading 100,000 images into RAM in <code>__init__</code>, we load a lightweight CSV containing the paths. We only read the actual image from the hard drive when <code>__getitem__</code> is called. This is called <strong>Lazy Loading</strong>.
        </p>

        <button 
          onClick={triggerFlow} 
          disabled={step > 0 && step < 4}
          className="w-full py-3 mb-6 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow transition-all flex justify-center items-center gap-2 disabled:opacity-50 flex-shrink-0"
        >
          {step === 0 || step === 4 ? "Simulate: __getitem__(1)" : "Processing Data Flow..."} <PlayCircle size={18}/>
        </button>

        {/* Visualizer */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col flex-1 relative min-h-[350px]">
           
           {/* Step 1: Read CSV */}
           <div className={`flex items-center gap-4 transition-all duration-500 ${step >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <div className="w-12 h-12 bg-white border-2 border-slate-300 text-slate-600 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                <FileSpreadsheet size={24} />
              </div>
              <div className="flex-1 bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
                <div className="bg-slate-100 px-3 py-1 border-b text-[10px] font-bold text-slate-500 flex justify-between">
                  <span>image_path</span><span>label</span>
                </div>
                <div className="px-3 py-1 text-xs font-mono text-slate-400 flex justify-between">
                  <span>img/cat1.jpg</span><span>0</span>
                </div>
                <div className="bg-indigo-100 border-y border-indigo-200 px-3 py-1 text-xs font-mono font-bold text-indigo-900 flex justify-between shadow-inner">
                  <span>img/dog1.png</span><span className="bg-emerald-500 text-white px-1 rounded">1</span>
                </div>
                <div className="px-3 py-1 text-xs font-mono text-slate-400 flex justify-between">
                  <span>img/bird1.jpg</span><span>2</span>
                </div>
              </div>
           </div>

           {/* Arrow down */}
           <div className={`flex justify-center transition-all duration-500 ${step >= 2 ? 'opacity-100 h-8' : 'opacity-0 h-0 overflow-hidden'}`}>
             <div className="w-0.5 h-full bg-indigo-300"></div>
           </div>

           {/* Step 2: Disk Read */}
           <div className={`flex items-center gap-4 transition-all duration-500 ${step >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <div className="w-12 h-12 bg-amber-100 border-2 border-amber-400 text-amber-700 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                <HardDrive size={24} />
              </div>
              <div className="flex-1 bg-white border-2 border-dashed border-amber-300 p-3 rounded shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-50 rounded flex items-center justify-center"><ImageIcon size={16} className="text-amber-500"/></div>
                <div>
                  <span className="block text-[10px] font-bold text-amber-700 uppercase">Image.open()</span>
                  <span className="text-xs font-mono text-slate-600">data/img/dog1.png</span>
                </div>
              </div>
           </div>

           {/* Arrow down */}
           <div className={`flex justify-center transition-all duration-500 ${step >= 3 ? 'opacity-100 h-8' : 'opacity-0 h-0 overflow-hidden'}`}>
             <div className="w-0.5 h-full bg-indigo-300 relative">
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-[9px] font-bold text-indigo-500 px-1 border border-indigo-200 rounded">Transform</div>
             </div>
           </div>

           {/* Step 3: Tensor Output */}
           <div className={`flex items-center gap-4 transition-all duration-500 ${step >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <div className="w-12 h-12 bg-emerald-100 border-2 border-emerald-400 text-emerald-700 rounded-full flex items-center justify-center shadow-md shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div className="flex-1 bg-indigo-50 border-2 border-indigo-300 p-3 rounded-xl shadow-md flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase mb-1">Image Tensor</span>
                  <span className="text-sm font-mono font-bold text-indigo-900">[3, 224, 224]</span>
                </div>
                <span className="text-2xl text-indigo-300">,</span>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Label Tensor</span>
                  <span className="text-sm font-mono font-bold text-white bg-emerald-500 px-3 py-1 rounded shadow-sm">1</span>
                </div>
              </div>
           </div>

        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner flex-1 overflow-y-auto min-h-[300px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-[11px] text-slate-400 font-mono">Python Code</span></div>
          <pre className="whitespace-pre-wrap font-mono text-[11px] text-emerald-100 leading-relaxed overflow-x-auto">
{pyCode}
          </pre>
        </div>
      </div>
    </div>
  );
}