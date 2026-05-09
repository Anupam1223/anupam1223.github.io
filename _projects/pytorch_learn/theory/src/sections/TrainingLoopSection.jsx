import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, ChevronLeft, ChevronRight, Code, Terminal, 
  Layers, PlayCircle, Pointer, ArrowDown, Database, 
  Activity, CheckCircle2, Server, Target, Wrench, Cpu, Zap, ArrowRight
} from 'lucide-react';

export default function TrainingLoopSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'loops', title: 'Epochs vs Batches', component: EpochBatchSlide },
    { id: 'steps', title: 'The 6 Core Steps', component: CoreStepsSlide },
    { id: 'code', title: 'The Complete Loop', component: CompleteLoopSlide },
    { id: 'setup', title: 'Setup (Model, Loss, Opt)', component: SetupSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <RefreshCw size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Anatomy of a Training Loop</h2>
        <p className="text-slate-400 text-sm mb-4">Managing the repetitive cycle of optimization</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2 flex-wrap">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 min-w-[30px] rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-teal-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase overflow-hidden">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-teal-400 whitespace-nowrap' : 'hidden md:inline whitespace-nowrap'}>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 font-semibold transition-colors"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}

// --- Slide 1: Epochs vs Batches ---
function EpochBatchSlide() {
  const [epoch, setEpoch] = useState(1);
  const [batchIdx, setBatchIdx] = useState(0); // 0 to 4 (5 batches per epoch)

  const processBatch = () => {
    if (batchIdx < 4) {
      setBatchIdx(batchIdx + 1);
    } else {
      setBatchIdx(0);
      setEpoch(e => e + 1);
    }
  };

  const resetSim = () => {
    setEpoch(1);
    setBatchIdx(0);
  };

  const pyCode = `for epoch in range(num_epochs):
    # OUTER LOOP: One full pass over the entire training dataset
    print(f"--- Starting Epoch {epoch+1} ---")
    
    for batch_idx, (data, labels) in enumerate(dataloader):
        # INNER LOOP: Process dataset in smaller segments (batches)
        print(f"Processing batch {batch_idx+1}")
        
        # ... core training steps go here ...`;

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Overall Structure: Nested Loops</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Training a neural network is an iterative optimization process handled by two nested loops: an outer loop for <strong>Epochs</strong> and an inner loop for <strong>Batches</strong>.
        </p>

        <div className="flex flex-col gap-4 mb-6">
          <div className="bg-white border-2 border-slate-200 rounded-xl p-4 shadow-sm">
            <h4 className="font-bold flex items-center gap-2 text-slate-800 mb-2"><RefreshCw size={18} className="text-teal-500"/> The Outer Loop (Epochs)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              An epoch indicates <strong>one full pass</strong> over the entire training dataset. We run multiple epochs so the model can learn from each sample multiple times.
            </p>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-xl p-4 shadow-sm">
            <h4 className="font-bold flex items-center gap-2 text-slate-800 mb-2"><Layers size={18} className="text-teal-500"/> The Inner Loop (Batches)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Processing the whole dataset at once crashes memory. Instead, we use a <code>DataLoader</code> to iterate through the data in smaller segments. This is more memory-efficient and leads to more stable convergence.
            </p>
          </div>
        </div>

        {/* Interactive Visualizer */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col flex-1 items-center justify-center relative overflow-hidden min-h-[220px]">
           <div className="w-full flex justify-between items-center mb-6">
             <div className="flex flex-col">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Epoch {epoch}</span>
             </div>
             <div className="flex gap-2">
               <button onClick={processBatch} className="text-[10px] bg-teal-600 text-white px-3 py-1.5 rounded shadow hover:bg-teal-700 flex items-center gap-1 font-bold">
                 {batchIdx === 4 ? 'Complete Epoch' : 'Process Batch'} <PlayCircle size={12}/>
               </button>
               <button onClick={resetSim} className="text-[10px] bg-white border border-slate-300 text-slate-600 px-3 py-1.5 rounded shadow-sm hover:bg-slate-100 font-bold">
                 Reset
               </button>
             </div>
           </div>

           <div className="w-full bg-slate-200 h-12 rounded-xl flex overflow-hidden border border-slate-300 shadow-inner relative">
             <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pointer-events-none">Full Dataset (100%)</div>
             {[0, 1, 2, 3, 4].map((b) => (
                <div 
                  key={b} 
                  className={`h-full flex-1 border-r border-white/20 transition-all duration-300 flex items-center justify-center
                    ${batchIdx > b ? 'bg-teal-500' : batchIdx === b ? 'bg-teal-300 animate-pulse' : 'bg-transparent'}`}
                >
                  {batchIdx >= b && <span className="text-white text-[10px] font-bold">Batch {b+1}</span>}
                </div>
             ))}
           </div>
           
           <div className="mt-4 text-[10px] text-teal-700 font-bold bg-teal-100 px-4 py-2 rounded-full shadow-sm">
             Inner Loop Iteration: {batchIdx} / 5
           </div>
        </div>

      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner flex-1 overflow-y-auto max-h-[300px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-[11px] text-slate-400 font-mono">Python Structure</span></div>
          <pre className="whitespace-pre-wrap font-mono text-[11px] text-emerald-100 leading-relaxed overflow-x-auto">
{pyCode}
          </pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 2: The 6 Core Steps (Diagram Recreation) ---
function CoreStepsSlide() {
  const [step, setStep] = useState(-1);

  const stepsData = [
    {
      title: "1. Get Batch (Data + Labels)",
      desc: "Retrieve the next batch of input features and target labels from the DataLoader. Crucially, transfer them to the correct computational device (e.g., inputs.to('cuda')).",
      code: "inputs, labels = next(iter(dataloader))\ninputs = inputs.to(device)\nlabels = labels.to(device)",
      bg: "bg-[#bde0fe]", // Light blue
      border: "border-slate-800"
    },
    {
      title: "2. Zero Gradients",
      desc: "Explicitly reset the gradients accumulated from the previous iteration. If you forget this step, gradients will continuously sum up across batches, leading to incorrect updates and divergence.",
      code: "optimizer.zero_grad()",
      bg: "bg-[#fceda6]", // Yellow/Orange
      border: "border-slate-800"
    },
    {
      title: "3. Forward Pass",
      desc: "Feed the batch of inputs into your model. The model processes the data through its layers and activation functions to produce a batch of predictions.",
      code: "predictions = model(inputs)",
      bg: "bg-[#aef5ce]", // Mint green
      border: "border-slate-800"
    },
    {
      title: "4. Calculate Loss",
      desc: "Compare the model's predictions against the true target labels using your chosen loss function (e.g., nn.CrossEntropyLoss). This returns a scalar value representing the average error.",
      code: "loss = criterion(predictions, labels)",
      bg: "bg-[#aef5ce]", // Mint green
      border: "border-slate-800"
    },
    {
      title: "5. Backpropagation",
      desc: "Autograd calculates the gradients. loss.backward() computes the gradient of the loss with respect to every model parameter that has requires_grad=True, storing them in .grad.",
      code: "loss.backward()",
      bg: "bg-[#fcd090]", // Orange
      border: "border-slate-800"
    },
    {
      title: "6. Update Weights",
      desc: "With gradients computed, the optimizer takes a small step in the direction that minimizes the loss, adjusting the model's internal parameters based on its specific algorithm (like Adam or SGD).",
      code: "optimizer.step()",
      bg: "bg-[#fcd090]", // Orange
      border: "border-slate-800"
    }
  ];

  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      
      {/* Left: The Vertical Flow Diagram (Screenshot Recreation) */}
      <div className="bg-[#202020] border-2 border-slate-300 rounded-2xl p-6 shadow-inner flex flex-col items-center relative min-h-[600px] overflow-hidden">
         
         <div className="bg-[#f0f3f5] border border-black p-6 w-full max-w-[340px] flex flex-col items-center relative z-10 shadow-lg">
            <span className="text-sm font-sans text-slate-800 mb-6">Training Epoch</span>

            {/* Start Oval */}
            <div className="w-[240px] h-[50px] bg-[#adb5bd] rounded-[100%] border border-black flex items-center justify-center text-xs font-sans text-slate-800 shadow-sm relative z-20">
               Start Batch Iteration
            </div>
            
            {/* The 6 Steps */}
            {stepsData.map((data, idx) => {
              const isActive = step === idx;
              return (
                <div key={idx} className="flex flex-col items-center w-full relative z-20">
                   {/* Arrow Down */}
                   <div className="h-6 w-0.5 bg-black relative">
                     <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-black"></div>
                   </div>
                   
                   {/* Box */}
                   <button 
                     onClick={() => setStep(idx)}
                     className={`w-[200px] h-[60px] flex flex-col items-center justify-center font-sans text-xs text-slate-900 border transition-all duration-300 cursor-pointer
                     ${data.bg} ${data.border} ${isActive ? 'ring-4 ring-white ring-offset-2 ring-offset-[#202020] scale-110 font-bold z-30 shadow-xl' : 'shadow-sm hover:scale-105'}`}
                   >
                     <span className="text-center px-2">{data.title}</span>
                     {idx === 0 && <span className="text-center">(Data + Labels)</span>}
                     {idx === 1 && <span className="text-center font-mono text-[9px] mt-0.5">optimizer.zero_grad()</span>}
                     {idx === 2 && <span className="text-center font-mono text-[9px] mt-0.5">predictions = model(inputs)</span>}
                     {idx === 3 && <span className="text-center font-mono text-[9px] mt-0.5">loss = criterion(preds, labels)</span>}
                     {idx === 4 && <span className="text-center font-mono text-[9px] mt-0.5">loss.backward()</span>}
                     {idx === 5 && <span className="text-center font-mono text-[9px] mt-0.5">optimizer.step()</span>}
                   </button>
                </div>
              );
            })}

            {/* Arrow Down to End */}
            <div className="h-6 w-0.5 bg-black relative z-20">
               <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-black"></div>
            </div>

            {/* End Oval */}
            <div className="w-[240px] h-[60px] bg-[#adb5bd] rounded-[100%] border border-black flex flex-col items-center justify-center text-xs font-sans text-slate-800 shadow-sm relative z-20">
               <span>End Batch Iteration</span>
               <span>(Repeat for next batch)</span>
            </div>

         </div>

         <p className="text-[#a4abb6] italic text-xs mt-6 text-center max-w-[340px]">
           Flow diagram illustrating the sequence of operations within a single batch iteration of the PyTorch training loop.
         </p>
      </div>

      {/* Right: Explanations and Code */}
      <div className="flex flex-col h-full gap-4">
        
        {/* Helper Navigation */}
        <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-3 rounded-xl shadow-sm">
           <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Interactive Flow</span>
           <button 
             onClick={() => setStep(s => s >= 5 ? -1 : s + 1)}
             className="bg-teal-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow hover:bg-teal-700 transition flex items-center gap-2"
           >
             {step === -1 ? "Start Iteration" : step === 5 ? "Reset Loop" : "Next Step"} <Pointer size={14}/>
           </button>
        </div>

        {/* Dynamic Content */}
        {step >= 0 ? (
          <>
            <div className="bg-white border-2 border-teal-200 p-6 rounded-2xl shadow-sm animate-in slide-in-from-right-4 duration-300">
               <h4 className="text-lg font-bold text-teal-900 mb-3">{stepsData[step].title}</h4>
               <p className="text-sm text-slate-600 leading-relaxed">{stepsData[step].desc}</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2">
                <Code size={14} className="text-teal-500" /> <span className="font-semibold uppercase text-teal-500 tracking-widest">Action Code</span>
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed text-emerald-300 mt-4 text-sm font-bold bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-inner">
                {stepsData[step].code}
              </pre>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 border border-slate-200 rounded-2xl border-dashed">
             <Activity size={48} className="mb-4 opacity-50" />
             <p className="font-bold">Click "Start Iteration" to explore.</p>
          </div>
        )}

      </div>
    </div>
  );
}

// --- Slide 3: The Complete Loop ---
function CompleteLoopSlide() {
  const pyCode = `import torch
import torch.nn as nn
import torch.optim as optim

# 0. Setup Model, Loss Function, and Optimizer
model = MyNeuralNetwork().to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Training configurations
num_epochs = 10

# --- OUTER LOOP (Epochs) ---
for epoch in range(num_epochs):
    
    # Set model to training mode (enables Dropout/BatchNorm)
    model.train() 
    
    running_loss = 0.0
    
    # --- INNER LOOP (Batches) ---
    for batch_idx, (inputs, labels) in enumerate(train_dataloader):
        
        # 1. Get Data: Move batch to device (GPU/CPU)
        inputs = inputs.to(device)
        labels = labels.to(device)
        
        # 2. Zero Gradients: Clear old gradients
        optimizer.zero_grad()
        
        # 3. Forward Pass: Compute predictions
        predictions = model(inputs)
        
        # 4. Calculate Loss: Compare with targets
        loss = criterion(predictions, labels)
        
        # 5. Backpropagation: Compute d(loss)/d(weights)
        loss.backward()
        
        # 6. Update Weights: Optimizer takes a step
        optimizer.step()
        
        # Track statistics
        running_loss += loss.item()
        
    # Print average loss for the epoch
    epoch_loss = running_loss / len(train_dataloader)
    print(f"Epoch [{epoch+1}/{num_epochs}], Loss: {epoch_loss:.4f}")
    
print("Training Complete!")`;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto pb-4 pr-2">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">The Complete Training Loop</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          Bringing it all together: Datasets, DataLoaders, Modules, Loss Functions, and Optimizers unite into the standard PyTorch training loop paradigm.
        </p>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner flex-1 overflow-y-auto min-h-[400px]">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-[11px] text-slate-400 font-mono">Putting it all together</span></div>
          <pre className="whitespace-pre-wrap font-mono text-[11px] sm:text-[12px] text-slate-300 leading-relaxed overflow-x-auto">
{pyCode}
          </pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 4: The Setup Phase (Pre-requisites) ---
function SetupSlide() {
  const [step, setStep] = useState(0);

  const stepsData = [
    {
      id: 'model',
      title: "1. Instantiating the Model",
      icon: <Layers size={18} className={step === 0 ? "text-white" : "text-teal-600"}/>,
      desc: "First, you need an instance of your neural network model. In Chapter 4, you learned how to define custom network architectures by subclassing torch.nn.Module. Now, you simply create an object of that class. This creates the network structure, including all its layers and parameters (weights and biases). Initially, these parameters have random values (or values determined by specific initialization schemes if you implemented them).",
    },
    {
      id: 'device',
      title: "2. Moving to the Correct Device",
      icon: <Server size={18} className={step === 1 ? "text-white" : "text-amber-500"}/>,
      desc: "Deep learning computations, especially training, are significantly faster on GPUs. PyTorch makes it straightforward to move your model to the appropriate device (CPU or GPU). Executing model.to(device) modifies the model in place, moving all its parameters and buffers to the GPU memory if CUDA is available, otherwise keeping them on the CPU. Remember, any tensor involved in computations with the model (like input data) must also reside on the same device.",
    },
    {
      id: 'loss',
      title: "3. Defining the Loss Function",
      icon: <Target size={18} className={step === 2 ? "text-white" : "text-rose-500"}/>,
      desc: "The loss function, often called the criterion, quantifies how far the model's predictions are from the actual target values. PyTorch provides numerous standard loss functions within the torch.nn module. The choice depends heavily on the type of problem you are solving (e.g., regression, classification). For a multi-class classification problem, nn.CrossEntropyLoss is common. It combines nn.LogSoftmax and nn.NLLLoss (Negative Log Likelihood Loss) in one efficient class.",
    },
    {
      id: 'opt',
      title: "4. Configuring the Optimizer",
      icon: <Wrench size={18} className={step === 3 ? "text-white" : "text-blue-500"}/>,
      desc: "The optimizer implements an algorithm (like Stochastic Gradient Descent or Adam) to adjust the model's parameters based on the gradients computed during backpropagation. When initializing an optimizer, you must provide two essential arguments: The model's parameters (using model.parameters()), and the learning rate (lr) which controls the step size for parameter updates. Different optimizers might have additional hyperparameters (like momentum for SGD, or betas for Adam).",
    }
  ];

  const pyCode = `# 1. Instantiate Model
model = SimpleNet(input_size=784, hidden_size=128, output_size=10)

# 2. Move to Device
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

# 3. Define Loss Function
loss_fn = torch.nn.CrossEntropyLoss()

# 4. Configure Optimizer
import torch.optim as optim
optimizer = optim.SGD(model.parameters(), lr=0.01)`;

  return (
    <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      
      {/* Left: Text and Buttons */}
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Setting Up the Prerequisites</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Before entering the iterative process of training, we need to prepare the core components: the model itself, a way to measure its error (the loss function), and a mechanism to update the model based on that error (the optimizer). This setup phase ensures all necessary pieces are initialized and ready for the training loop.
        </p>

        <div className="flex flex-col gap-3 flex-1 mb-6">
          {stepsData.map((data, idx) => {
            const isActive = step === idx;
            return (
              <button 
                key={data.id}
                onClick={() => setStep(idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 flex flex-col gap-2 
                  ${isActive ? 'bg-teal-600 border-teal-700 text-white shadow-md transform scale-[1.01]' : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300'}`}
              >
                <div className="flex items-center gap-2">
                  {data.icon}
                  <span className="font-bold text-[13px]">{data.title}</span>
                  {step > idx && <CheckCircle2 size={16} className="ml-auto text-emerald-500 flex-shrink-0" />}
                </div>
                {isActive && (
                  <p className="text-[11px] text-teal-50 leading-relaxed animate-in fade-in mt-1 border-t border-teal-500/50 pt-2">
                    {data.desc}
                  </p>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Right: Visual Workbench & Code */}
      <div className="flex flex-col gap-6">
        
        {/* Interactive Visual Workbench */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden">
          <span className="absolute top-4 left-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">The Workbench</span>
          
          <div className="w-full flex flex-col gap-4 mt-6 relative z-10">
            
            {/* Device & Model Container */}
            <div className="flex items-center gap-4 w-full h-[90px] relative">
              {/* CPU Box */}
              <div className="flex-1 border-2 border-dashed border-slate-300 rounded-xl h-full flex flex-col items-center justify-center bg-white shadow-sm relative">
                <span className="absolute top-1 left-2 text-[10px] font-bold text-slate-400 uppercase"><Cpu size={12} className="inline mr-1"/> CPU</span>
                <div className={`transition-all duration-700 absolute ${step === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                  <div className="bg-teal-100 border-2 border-teal-400 text-teal-900 font-mono text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-2">
                    <Layers size={14}/> SimpleNet
                  </div>
                </div>
              </div>

              {step >= 1 && <ArrowRight className="text-amber-400 animate-in fade-in flex-shrink-0" size={24} />}

              {/* GPU Box */}
              <div className={`flex-1 border-2 transition-all duration-500 rounded-xl h-full flex flex-col items-center justify-center shadow-sm relative ${step >= 1 ? 'border-amber-400 bg-amber-50' : 'border-dashed border-slate-300 bg-slate-50 opacity-50'}`}>
                <span className={`absolute top-1 left-2 text-[10px] font-bold uppercase ${step >= 1 ? 'text-amber-600' : 'text-slate-400'}`}><Zap size={12} className="inline mr-1"/> GPU</span>
                <div className={`transition-all duration-700 absolute ${step >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50 translate-x-[-30px]'}`}>
                  <div className="bg-teal-100 border-2 border-teal-400 text-teal-900 font-mono text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-2">
                    <Layers size={14}/> SimpleNet
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-4 mt-2">
              {/* Loss Box */}
              <div className={`flex-1 transition-all duration-500 flex flex-col items-center p-3 rounded-xl border-2 ${step >= 2 ? 'bg-rose-50 border-rose-400 shadow-md opacity-100 translate-y-0' : 'border-transparent opacity-0 translate-y-4'}`}>
                 <Target size={20} className="text-rose-500 mb-1"/>
                 <span className="text-[9px] font-bold text-rose-900 uppercase">CrossEntropyLoss</span>
              </div>

              {/* Optimizer Box */}
              <div className={`flex-1 transition-all duration-500 flex flex-col items-center p-3 rounded-xl border-2 relative ${step >= 3 ? 'bg-blue-50 border-blue-400 shadow-md opacity-100 translate-y-0' : 'border-transparent opacity-0 translate-y-4'}`}>
                 {step >= 3 && (
                   <div className="absolute -top-10 left-1/2 w-0.5 h-10 bg-blue-400 border-l-2 border-dashed border-blue-400 -translate-x-1/2 flex items-center justify-center">
                     <span className="bg-white text-blue-600 text-[7px] font-bold px-1 whitespace-nowrap border border-blue-200 rounded">model.parameters()</span>
                   </div>
                 )}
                 <Wrench size={20} className="text-blue-500 mb-1"/>
                 <span className="text-[9px] font-bold text-blue-900 uppercase">optim.SGD(lr=0.01)</span>
              </div>
            </div>

          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[10px] text-slate-300 flex-1 overflow-y-auto max-h-[220px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-slate-400" /> <span className="font-semibold uppercase text-slate-400">Python Setup Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed overflow-x-auto">
{`# 1. Instantiate Model
`}
<span className={step === 0 ? "text-teal-300 font-bold bg-teal-900/30 px-1 rounded inline-block w-full" : "text-emerald-100"}>model = SimpleNet(input_size=784, hidden_size=128, output_size=10)</span>
{`

# 2. Move to Device
`}
<span className={step === 1 ? "text-amber-300 font-bold bg-amber-900/30 px-1 rounded inline-block w-full" : "text-emerald-100"}>{`device = "cuda" if torch.cuda.is_available() else "cpu"\nmodel.to(device)`}</span>
{`

# 3. Define Loss Function
`}
<span className={step === 2 ? "text-rose-300 font-bold bg-rose-900/30 px-1 rounded inline-block w-full" : "text-emerald-100"}>loss_fn = torch.nn.CrossEntropyLoss()</span>
{`

# 4. Configure Optimizer
`}
<span className={step === 3 ? "text-blue-300 font-bold bg-blue-900/30 px-1 rounded inline-block w-full" : "text-emerald-100"}>{`import torch.optim as optim\noptimizer = optim.SGD(model.parameters(), lr=0.01)`}</span>
          </pre>
        </div>
      </div>
    </div>
  );
}