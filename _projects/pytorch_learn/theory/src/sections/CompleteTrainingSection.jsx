import React, { useState, useEffect } from 'react';
import { 
  Rocket, ChevronLeft, ChevronRight, Code, Terminal, 
  Database, Cpu, Zap, Layers, RefreshCw, ShieldCheck, 
  Save, PlayCircle, ArrowRight, Target, Wrench
} from 'lucide-react';

export default function CompleteWorkflowSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'prep', title: '1. Setup & Data Prep', component: DataPrepSlide },
    { id: 'train', title: '2. The Training Loop', component: TrainLoopSlide },
    { id: 'eval', title: '3. The Evaluation Loop', component: EvalLoopSlide },
    { id: 'persist', title: '4. Save, Load & Predict', component: PersistenceSlide },
  ];

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-6 rounded-2xl text-white relative overflow-hidden mb-6 shadow-md">
        <div className="absolute top-0 right-0 opacity-10">
          <Rocket size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <h2 className="text-2xl font-bold mb-2">End-to-End PyTorch Workflow</h2>
        <p className="text-slate-400 text-sm mb-4">Putting it all together: A complete Linear Regression masterclass</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-2 flex-wrap">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 flex-1 min-w-[30px] rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSlide ? 'bg-blue-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-widest uppercase overflow-hidden">
          {slides.map((slide, idx) => (
            <span key={idx} className={idx === currentSlide ? 'text-blue-400 whitespace-nowrap font-bold' : 'hidden md:inline whitespace-nowrap'}>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 font-semibold transition-colors"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}

// --- Slide 1: Setup & Data Prep ---
function DataPrepSlide() {
  const [step, setStep] = useState(0);

  const pyCode = `import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import TensorDataset, DataLoader

# 1. Setup: Hyperparameters and Device
learning_rate = 0.01
num_epochs = 100
batch_size = 16
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

# 2. Data Preparation (y = 2x + 1 + noise)
true_weight = torch.tensor([[2.0]])
true_bias = torch.tensor([1.0])
X_train_tensor = torch.randn(100, 1, device=device) * 5
y_train_tensor = true_weight.to(device) * X_train_tensor + true_bias.to(device) + torch.randn(100, 1, device=device) * 0.5
X_val_tensor = torch.randn(20, 1, device=device) * 5
y_val_tensor = true_weight.to(device) * X_val_tensor + true_bias.to(device) + torch.randn(20, 1, device=device) * 0.5

train_dataset = TensorDataset(X_train_tensor, y_train_tensor)
val_dataset = TensorDataset(X_val_tensor, y_val_tensor)
train_loader = DataLoader(dataset=train_dataset, batch_size=batch_size, shuffle=True)
val_loader = DataLoader(dataset=val_dataset, batch_size=batch_size, shuffle=False)

# 3. Model, Loss, and Optimizer
model = nn.Linear(1, 1).to(device)
loss_fn = nn.MSELoss()
optimizer = optim.SGD(model.parameters(), lr=learning_rate)

print("Model definition:\\n", model)
print("\\nInitial parameters:")
for name, param in model.named_parameters():
    if param.requires_grad:
        print(f"{name}: {param.data.squeeze()}")`;

  const outCode = `Using device: cuda\nModel definition:\nLinear(in_features=1, out_features=1, bias=True)\n\nInitial parameters:\nweight: -0.3421\nbias: 0.1294`;

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Phase 1: Setup & Initialization</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Before any training occurs, we must generate our synthetic data, wrap it in DataLoaders for batching, and initialize the core triad: <strong>Model</strong>, <strong>Loss</strong>, and <strong>Optimizer</strong>.
        </p>

        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-center gap-6 shadow-inner relative overflow-hidden">
           
           {/* Visualizer */}
           <div className="w-full flex flex-col gap-6 relative z-10">
              
              {/* Data Pipeline */}
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-left-4">
                 <div className="flex flex-col items-center">
                   <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center border border-blue-300"><Database size={24}/></div>
                   <span className="text-[9px] font-bold mt-1 text-slate-500 uppercase">Tensors</span>
                 </div>
                 <ArrowRight className="text-slate-300 shrink-0"/>
                 <div className="flex-1 bg-blue-50 border border-blue-200 p-2 rounded-lg flex flex-col items-center text-center">
                   <span className="text-[10px] font-bold text-blue-800 uppercase mb-1">TensorDataset</span>
                   <span className="text-[9px] text-blue-600 font-mono">Pairs (X, y)</span>
                 </div>
                 <ArrowRight className="text-slate-300 shrink-0"/>
                 <div className="flex-1 bg-indigo-100 border border-indigo-300 p-2 rounded-lg flex flex-col items-center text-center shadow-sm">
                   <span className="text-[10px] font-bold text-indigo-900 uppercase mb-1">DataLoader</span>
                   <span className="text-[9px] text-indigo-700 font-mono">Batches of 16</span>
                 </div>
              </div>

              {/* Core Triad */}
              <div className="flex gap-4">
                 <div className="flex-1 bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex flex-col items-center text-center shadow-sm animate-in slide-in-from-bottom-4 delay-75">
                   <Layers className="text-emerald-500 mb-2" size={20}/>
                   <span className="text-[10px] font-bold text-emerald-900 uppercase">Model</span>
                   <span className="text-[9px] text-emerald-700 font-mono">nn.Linear(1, 1)</span>
                 </div>
                 <div className="flex-1 bg-rose-50 border border-rose-200 p-3 rounded-xl flex flex-col items-center text-center shadow-sm animate-in slide-in-from-bottom-4 delay-150">
                   <Target className="text-rose-500 mb-2" size={20}/>
                   <span className="text-[10px] font-bold text-rose-900 uppercase">Loss</span>
                   <span className="text-[9px] text-rose-700 font-mono">nn.MSELoss()</span>
                 </div>
                 <div className="flex-1 bg-amber-50 border border-amber-200 p-3 rounded-xl flex flex-col items-center text-center shadow-sm animate-in slide-in-from-bottom-4 delay-300">
                   <Wrench className="text-amber-500 mb-2" size={20}/>
                   <span className="text-[10px] font-bold text-amber-900 uppercase">Optimizer</span>
                   <span className="text-[9px] text-amber-700 font-mono">SGD(lr=0.01)</span>
                 </div>
              </div>

              {/* Device */}
              <div className="bg-slate-800 text-white p-3 rounded-xl flex items-center justify-center gap-3 shadow-md animate-in slide-in-from-bottom-4 delay-500">
                 <Zap className="text-amber-400" size={18}/>
                 <span className="text-xs font-mono font-bold">All components moved .to('cuda')</span>
              </div>

           </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[350px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-blue-400" /> <span className="font-semibold uppercase text-blue-400">Python Setup Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[150px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} className="text-slate-400"/> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{outCode}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 2: The Training Loop ---
function TrainLoopSlide() {
  const [animating, setAnimating] = useState(false);
  const [epoch, setEpoch] = useState(0);

  useEffect(() => {
    let interval;
    if (animating) {
      interval = setInterval(() => {
        setEpoch(e => {
          if (e >= 100) {
            setAnimating(false);
            return 100;
          }
          return e + 10;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [animating]);

  const pyCode = `# 4. Training Loop
print("\\nStarting Training...")
for epoch in range(num_epochs):
    model.train() # Set mode!
    running_loss = 0.0
    num_batches = 0
    
    for i, (features, labels) in enumerate(train_loader):
        # Forward Pass
        outputs = model(features)
        loss = loss_fn(outputs, labels)
        
        # Backward Pass & Optimize
        optimizer.zero_grad() # Crucial!
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item()
        num_batches += 1

    avg_epoch_loss = running_loss / num_batches
    if (epoch + 1) % 10 == 0:
        print(f"Epoch [{epoch+1}/{num_epochs}], Training Loss: {avg_epoch_loss:.4f}")

print("Training Finished!")`;

  const getLoss = (ep) => {
    if (ep === 0) return 25.4321;
    return (25.4321 * Math.exp(-ep/20)).toFixed(4); // Fake exponential decay
  };

  let outCodeStr = "Starting Training...\n";
  for(let i=10; i<=epoch; i+=10) {
    outCodeStr += `Epoch [${i}/100], Training Loss: ${getLoss(i)}\n`;
  }
  if (epoch === 100) outCodeStr += "Training Finished!";

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Phase 2: The Training Loop</h3>
        <p className="text-slate-600 mb-4 leading-relaxed text-sm">
          The core optimization cycle. For every batch, we perform a forward pass to get the loss, then trigger <code>.backward()</code>, and finally update the weights with <code>.step()</code>.
        </p>

        <button 
          onClick={() => { setEpoch(0); setAnimating(true); }}
          disabled={animating}
          className="w-full py-3 mb-6 bg-blue-600 text-white rounded-lg text-sm font-bold shadow hover:bg-blue-700 transition-all flex justify-center items-center gap-2 flex-shrink-0 disabled:opacity-50"
        >
          {animating ? "Training in Progress..." : epoch === 100 ? "Restart Training" : "Start Training"} <PlayCircle size={18}/>
        </button>

        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-center items-center relative overflow-hidden min-h-[250px]">
           <h4 className="absolute top-4 left-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Loss Tracker</h4>
           
           <div className="w-full max-w-sm h-32 border-l-2 border-b-2 border-slate-400 relative mt-4 flex items-end">
              {/* Dynamic Chart Line based on Epoch */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible p-2">
                 <polyline 
                   points={Array.from({length: epoch/10 + 1}, (_, i) => {
                     const x = i * 10;
                     const y = 100 - (getLoss(i*10) / 25.4321) * 100;
                     return `${x},${y}`;
                   }).join(' ')}
                   fill="none" 
                   stroke="#3b82f6" 
                   strokeWidth="4" 
                   strokeLinejoin="round" 
                 />
              </svg>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500">Epoch {epoch} / 100</div>
           </div>

           <div className="mt-12 bg-white px-4 py-2 border border-slate-300 rounded-lg shadow-sm font-mono text-sm font-bold text-blue-900 w-full max-w-sm text-center">
             Current Avg Loss: {epoch === 0 ? '--' : getLoss(epoch)}
           </div>

        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[350px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-blue-400" /> <span className="font-semibold uppercase text-blue-400">Python Training Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[150px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} className="text-slate-400"/> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{outCodeStr}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 3: The Eval Loop ---
function EvalLoopSlide() {
  const pyCode = `# 5. Evaluation Loop
print("\\nStarting Evaluation...")
model.eval() # Set mode! Freeze BatchNorm/Dropout

total_val_loss = 0.0
num_val_batches = 0

# Disable gradient tracking to save VRAM and time!
with torch.no_grad():
    for features, labels in val_loader:
        # Forward pass ONLY
        outputs = model(features)
        loss = loss_fn(outputs, labels)
        
        total_val_loss += loss.item()
        num_val_batches += 1

avg_val_loss = total_val_loss / num_val_batches
print(f"Validation Loss: {avg_val_loss:.4f}")

# Check final learned parameters
print("\\nLearned parameters:")
for name, param in model.named_parameters():
    if param.requires_grad:
        print(f"{name}: {param.data.squeeze().item():.4f}")

print(f"(True weight: {true_weight.item():.4f}, True bias: {true_bias.item():.4f})")`;

  const outCode = `Starting Evaluation...
Validation Loss: 0.2135

Learned parameters:
weight: 1.9842
bias: 1.0115
(True weight: 2.0000, True bias: 1.0000)`;

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Phase 3: Evaluation</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          After training, we objectively test the model on the Validation DataLoader. Crucially, we turn off the computation graph using <code>torch.no_grad()</code> and set the mode to <code>model.eval()</code>.
        </p>

        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col justify-center gap-4 relative overflow-hidden min-h-[300px]">
           
           <div className="w-full flex flex-col gap-4 relative z-10 animate-in slide-in-from-left-4">
              
              <div className="bg-indigo-50 border-2 border-indigo-400 p-4 rounded-xl flex items-center gap-4 shadow-sm">
                <ShieldCheck size={28} className="text-indigo-600 shrink-0"/>
                <div>
                  <h4 className="font-bold text-indigo-900 text-sm">model.eval()</h4>
                  <p className="text-[10px] text-indigo-700 leading-tight mt-1">Freezes layers that behave differently during training.</p>
                </div>
              </div>

              <div className="bg-emerald-50 border-2 border-emerald-400 p-4 rounded-xl flex items-center gap-4 shadow-sm delay-75 animate-in slide-in-from-left-4">
                <Zap size={28} className="text-emerald-600 shrink-0"/>
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">with torch.no_grad():</h4>
                  <p className="text-[10px] text-emerald-700 leading-tight mt-1">Disables the Autograd engine. Drastically cuts VRAM usage and speeds up the forward pass.</p>
                </div>
              </div>

              <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-xl flex items-center gap-4 shadow-sm delay-150 animate-in slide-in-from-left-4">
                <Target size={28} className="text-amber-600 shrink-0"/>
                <div>
                  <h4 className="font-bold text-amber-900 text-sm">Validation Results</h4>
                  <p className="text-[10px] text-amber-700 leading-tight mt-1">The learned weights (1.98, 1.01) are extremely close to the true equations (2.0, 1.0)!</p>
                </div>
              </div>

           </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[350px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-blue-400" /> <span className="font-semibold uppercase text-blue-400">Python Eval Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[150px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} className="text-slate-400"/> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{outCode}</pre>
        </div>
      </div>
    </div>
  );
}

// --- Slide 4: Persistence ---
function PersistenceSlide() {
  const pyCode = `# 6. Saving and Loading Model State
model_save_path = 'linear_regression_model.pth'

# Extract the state dictionary and save to disk
torch.save(model.state_dict(), model_save_path)
print(f"\\nModel state_dict saved to {model_save_path}")

# To Load: Instantiate a blank model shell first
loaded_model = nn.Linear(1, 1).to(device)

# Load the weights dictionary and inject them
loaded_model.load_state_dict(torch.load(model_save_path))
loaded_model.eval() # Set to eval mode for inference
print("Model state_dict loaded successfully.")

# Run inference on new data!
with torch.no_grad():
    sample_input = torch.tensor([[10.0]]).to(device)
    prediction = loaded_model(sample_input)
    print(f"Prediction for input 10.0: {prediction.item():.4f}")
    
    # Expected: y = 2(10) + 1 = 21.0`;

  const outCode = `Model state_dict saved to linear_regression_model.pth
Model state_dict loaded successfully.
Prediction for input 10.0: 20.8540`;

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 animate-in fade-in duration-500 h-full overflow-y-auto pb-4 pr-2">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4">Phase 4: Persistence & Inference</h3>
        <p className="text-slate-600 mb-6 leading-relaxed text-sm">
          Finally, we extract the learned weights using <code>state_dict()</code> and save them to a <code>.pth</code> file. Later, we can load this dictionary into a new model shell to make real-world predictions.
        </p>

        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
           
           <div className="flex flex-col items-center w-full gap-4">
              
              <div className="flex items-center gap-4 w-full justify-center">
                 <div className="bg-white border-2 border-emerald-400 p-3 rounded-xl shadow text-center w-24 flex flex-col items-center">
                   <Layers className="text-emerald-500 mb-1" size={24}/>
                   <span className="text-[10px] font-bold text-slate-600">Model</span>
                 </div>
                 <ArrowRight className="text-emerald-400"/>
                 <div className="bg-slate-800 border-2 border-slate-600 p-3 rounded-xl shadow-lg text-center w-24 flex flex-col items-center">
                   <Save className="text-white mb-1" size={24}/>
                   <span className="text-[10px] font-bold text-white font-mono">.pth File</span>
                 </div>
              </div>

              <div className="h-8 border-l-2 border-dashed border-slate-300"></div>

              <div className="flex items-center gap-4 w-full justify-center">
                 <div className="bg-slate-800 border-2 border-slate-600 p-3 rounded-xl shadow-lg text-center w-24 flex flex-col items-center">
                   <Save className="text-white mb-1" size={24}/>
                   <span className="text-[10px] font-bold text-white font-mono">.pth File</span>
                 </div>
                 <ArrowRight className="text-blue-400"/>
                 <div className="bg-blue-50 border-2 border-blue-400 p-3 rounded-xl shadow text-center w-28 flex flex-col items-center relative">
                   <span className="absolute -top-3 text-[8px] bg-blue-100 border border-blue-300 text-blue-800 px-1 rounded uppercase font-bold">New Shell</span>
                   <Layers className="text-blue-500 mb-1" size={24}/>
                   <span className="text-[10px] font-bold text-slate-600">loaded_model</span>
                 </div>
              </div>

              <div className="mt-4 bg-emerald-100 text-emerald-800 text-xs px-4 py-2 rounded-full border border-emerald-300 font-bold font-mono">
                Prediction(10.0) ≈ 21.0
              </div>
           </div>

        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden h-full">
        <div className="bg-slate-900 rounded-xl p-4 shadow-inner font-mono text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[350px]">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Code size={14} className="text-blue-400" /> <span className="font-semibold uppercase text-blue-400">Python Persistence Code</span></div>
          <pre className="whitespace-pre-wrap leading-relaxed">{pyCode}</pre>
        </div>
        <div className="bg-black/80 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-[150px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2"><Terminal size={14} className="text-slate-400"/> <span className="font-semibold uppercase text-slate-400">Console Output</span></div>
          <pre className="whitespace-pre-wrap">{outCode}</pre>
        </div>
      </div>
    </div>
  );
}