import React, { useState } from 'react';
import { 
  Database, 
  BrainCircuit, 
  Activity, 
  Layers, 
  PlayCircle, 
  FolderTree,
  ArrowRight,
  ArrowDown,
  RefreshCw,
  FileCode2,
  Save,
  Info,
  Clock,
  ShieldCheck,
  AlertTriangle,
  GitMerge,
  Zap,
  Target,
  Scissors,
  Calculator,
  Undo2,
  Cpu,
  Sigma,
  ArrowLeftRight,
  LineChart,
  RotateCcw,
  ShieldAlert,
  Trophy,
  Cloud
} from 'lucide-react';

const ScadaExplorer = () => {
  const [activeTab, setActiveTab] = useState('train');

  const tabs = [
    { id: 'data', label: '1. Data Partitioning', icon: Database },
    { id: 'brain', label: '2. The Brain (MLP)', icon: BrainCircuit },
    { id: 'muscle', label: '3. The Muscle (Affine)', icon: Activity },
    { id: 'flow', label: '4. The Wrapper', icon: Layers },
    { id: 'train', label: '5. The Trainer', icon: PlayCircle },
    { id: 'structure', label: '6. Project Structure', icon: FolderTree },
  ];

  return (
    <div className="flex h-full bg-gray-950 text-gray-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shadow-xl z-10 flex-shrink-0">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            SMPC Flow
          </h1>
          <p className="text-xs text-gray-400 mt-1">Architecture Explainer</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-6 py-4 text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-900/20 text-blue-400 border-r-4 border-blue-500 shadow-inner' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-950 p-8 scrollbar-thin">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'data' && <DataTab />}
          {activeTab === 'brain' && <BrainTab />}
          {activeTab === 'muscle' && <MuscleTab />}
          {activeTab === 'flow' && <FlowTab />}
          {activeTab === 'train' && <TrainerTab />}
          {activeTab === 'structure' && <StructureTab />}
        </div>
      </div>
    </div>
  );
};

// --- TAB COMPONENTS ---

const DataTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
    <Header 
      title="Dataset Module: Initialization & Preprocessing" 
      subtitle="src/data/dataset.py" 
      description="The foundation of the pipeline. SCADA data requires careful handling of time-series continuity, physics-based partitioning, and strict data-leakage prevention."
    />
    
    {/* Section 1: Ingestion & Splitting */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
      <Card title="Step 1: Ingestion & Chronological Splitting" icon={Clock} iconColor="text-amber-400">
        <CodeBlock language="python">{`# 1. LOAD DATA & CLEAN COLUMNS
raw_df = pd.read_excel(data_path) 
raw_df.columns = raw_df.columns.str.strip().str.replace(r'\\s+', '_', regex=True)

# 2. CHRONOLOGICAL SPLIT (80% Train / 20% Val)
split_idx = int(len(raw_df) * 0.8)

if self.split == 'train':
    df = raw_df.iloc[:split_idx].copy()
elif self.split == 'val':
    df = raw_df.iloc[split_idx:].copy()
else:
    raise ValueError("Split must be 'train' or 'val'")`}</CodeBlock>
      </Card>
      
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg flex flex-col justify-center">
        <h3 className="text-lg font-bold text-gray-200 mb-3 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-amber-400" /> Time-Series Continuity
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed mb-6">
          Standard machine learning datasets are often shuffled randomly. <strong>We cannot do this with SCADA data.</strong> Sensor data has temporal dependencies (e.g., pressure at T=5 is related to T=4). By using <code>.iloc[:split_idx]</code>, we ensure the model trains on the first 80% of the timeline and is validated on the chronological "future" 20%.
        </p>
        <div className="w-full bg-gray-950 rounded-lg border border-gray-800 p-2 flex overflow-hidden">
          <div className="w-[80%] bg-blue-900/60 border border-blue-500/50 p-3 text-center text-xs font-bold text-blue-300">
            Train Split (0% - 80%)
          </div>
          <div className="w-[20%] bg-rose-900/60 border border-rose-500/50 p-3 text-center text-xs font-bold text-rose-300 border-l-0">
            Val Split
          </div>
        </div>
      </div>
    </div>

    {/* Section 2: The 3-Way Partition */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch mt-8">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg flex flex-col">
        <h3 className="text-lg font-bold text-gray-200 mb-6 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-indigo-400" />
          The 3-Way Partition Logic
        </h3>
        
        <div className="flex flex-col gap-4 flex-1 justify-center">
          <div className="flex gap-4">
            <div className="flex-1 bg-blue-900/40 border border-blue-700/50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-blue-300 font-bold mb-1 text-lg">X</span>
              <span className="text-xs text-blue-200 mb-2">Measured Context</span>
              <ul className="text-[10px] text-gray-400 text-left list-disc pl-4 space-y-1">
                <li>Suction Pressure</li>
                <li>Suction Drum Temp</li>
                <li>Fuel Gas LHV</li>
              </ul>
            </div>
            <div className="flex-1 bg-amber-900/40 border border-amber-700/50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-amber-300 font-bold mb-1 text-lg">U</span>
              <span className="text-xs text-amber-200 mb-2">Controls</span>
              <ul className="text-[10px] text-gray-400 text-left list-disc pl-4 space-y-1">
                <li>Turbine Shaft Speed</li>
                <li>PDCV-504 Valve</li>
                <li>Seal Gas Supply</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-rose-900/40 border border-rose-700/50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-rose-300 font-bold mb-1 text-lg">θ</span>
            <span className="text-xs text-rose-200 mb-2">Uncertain Future / Targets (8 Variables)</span>
            <div className="text-[10px] text-gray-400 flex flex-wrap gap-2 justify-center max-w-sm">
              <span className="bg-gray-950 px-2 py-1 rounded border border-gray-800">Seal_Gas_Fltr_DP</span>
              <span className="bg-gray-950 px-2 py-1 rounded border border-gray-800">Lube_Oil_Lvl</span>
              <span className="bg-gray-950 px-2 py-1 rounded border border-gray-800">Thermal_Efficiency</span>
              <span className="bg-gray-950 px-2 py-1 rounded border border-gray-800">Isentropic_Eff</span>
              <span className="bg-gray-950 px-2 py-1 rounded border border-gray-800">Discharge_Press</span>
              <span className="bg-gray-950 px-2 py-1 rounded border border-gray-800">Discharge_Temp</span>
              <span className="bg-gray-950 px-2 py-1 rounded border border-gray-800">Exhaust_Spread</span>
              <span className="bg-blue-900/30 px-2 py-1 rounded border border-blue-800 text-blue-300 font-bold">Turbine_Heat_Rate</span>
            </div>
          </div>
          <div className="text-xs text-center text-gray-500 mt-1 italic">
            *Heat Rate added to guarantee an even 4/4 split for the Coupling Layers.
          </div>
        </div>
      </div>

      <Card title="Step 2: Assigning the Partitions" icon={Database} iconColor="text-blue-400">
        <CodeBlock language="python">{`# 3. SEPARATE THE 3 PARTITIONS

# x: Measured Now (100% Certain Context)
self.x_cols = [
    'COMP_Suction_Pressure', 
    'COMP_Suction_Drum_Temperature', 
    'KPI_Fuel_Gas_Lower_Heating_Value'
]

# u: Controls (Operator Dials)
self.u_cols = [
    'Turbine_SHAFT_SPEED', 
    'UK_14PDCV-504_H-SEL', 
    'SEAL_GAS_SUP_DE'
]

# theta: Uncertain Future (Simulated Variables)
self.theta_cols = [
    'SEAL_GAS_FLTR_DP', 
    'LUBE_OIL_LVL_XMTR_HI/LO_TNK', 
    'KPI_Turbine_Overall_Thermal_Cycle_Efficiency', 
    'KPI_Gas_COMP_Isentropic_Efficiency', 
    'COMP_Discharge_Pressure', 
    'COMP_Discharge_Temp', 
    'Exhaust_Temp_Spread_1',
    'KPI_Turbine_Heat_Rate' # 8th Feature
]`}</CodeBlock>
      </Card>
    </div>

    {/* Section 3: Data Leakage & Normalization */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch mt-8">
      <Card title="Step 3: Leakage-Free Normalization" icon={ShieldCheck} iconColor="text-emerald-400">
        <CodeBlock language="python">{`# B. Apply Standard Scaling WITHOUT DATA LEAKAGE
if self.split == 'train':
    # Calculate the math ONLY on training data
    self.scaler_stats = {
        'x_mean': np.mean(raw_x, axis=0), 
        'x_std': np.std(raw_x, axis=0) + 1e-8,
        # ... calculates u and theta stats ...
    }
    # Save the math to disk!
    torch.save(self.scaler_stats, self.scaler_path)
    
else:
    # Validation/Inference MUST load the training math
    self.scaler_stats = torch.load(self.scaler_path)

# Apply the scaling math safely
self.x_data = (raw_x - self.scaler_stats['x_mean']) / self.scaler_stats['x_std']
self.u_data = (raw_u - self.scaler_stats['u_mean']) / self.scaler_stats['u_std']
self.theta_data = (raw_theta - self.scaler_stats['theta_mean']) / self.scaler_stats['theta_std']`}</CodeBlock>
      </Card>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg flex flex-col justify-center">
        <h3 className="text-lg font-bold text-gray-200 mb-3 flex items-center">
          <ShieldCheck className="w-5 h-5 mr-2 text-emerald-400" /> Preventing Data Leakage
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed mb-4">
          <strong className="text-emerald-300">Why prevent it?</strong> If you calculate standard deviation across the <i>entire</i> timeline before splitting, future anomalies (like a filter clogging in Month 11) will artificially inflate the standard deviation used to scale Month 1. The model becomes biased, peeking at future variance, which makes validation metrics look great but causes it to fail drastically in live edge deployments.
        </p>
        <p className="text-sm text-gray-300 leading-relaxed mb-4">
          <strong className="text-emerald-300">How we achieve it:</strong> We strictly branch our scaling logic based on the <code>self.split</code> variable. The <code>mean</code> and <code>std</code> are calculated <b>exclusively on the training split</b> and then frozen inside <code>scaler.pt</code>. When the validation dataset (or a live edge device) loads, it is forced to use the exact math generated by the historical training data.
        </p>
        
        <div className="space-y-3 mt-auto">
          <div className="bg-emerald-950/30 border border-emerald-900/50 p-3 rounded-lg flex items-start gap-3">
            <div className="mt-0.5"><Save className="w-4 h-4 text-emerald-400" /></div>
            <div>
              <p className="text-sm font-bold text-emerald-300 mb-1">When split == 'train'</p>
              <p className="text-xs text-emerald-100/70">Calculates physical statistics (means/variances) and saves them to <code>scaler.pt</code>.</p>
            </div>
          </div>
          
          <div className="bg-blue-950/30 border border-blue-900/50 p-3 rounded-lg flex items-start gap-3">
            <div className="mt-0.5"><Database className="w-4 h-4 text-blue-400" /></div>
            <div>
              <p className="text-sm font-bold text-blue-300 mb-1">When split == 'val' (or Edge Deployment)</p>
              <p className="text-xs text-blue-100/70">Loads <code>scaler.pt</code>. Uses the exact historical math to scale new incoming live data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Section 4: Interactive Deep Dive */}
    <div className="mt-12 pt-8 border-t border-gray-800">
      <h3 className="text-xl font-bold text-gray-200 mb-2 flex items-center gap-2">
        <AlertTriangle className="w-6 h-6 text-yellow-500" /> 
        Interactive Deep Dive: Scaling, Leakage & The Jacobian
      </h3>
      <p className="text-sm text-gray-400 mb-6 max-w-4xl">
        This interactive visualizer demonstrates exactly what happens to your SCADA data during the Normalizing Flow preprocessing phase. 
        Click through the steps below to see why <strong>Data Leakage</strong> destroys predictions and why scaling the data mathematically modifies its probability volume (the <strong>Missing Jacobian</strong>).
      </p>
      
      <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-2xl border border-gray-700 bg-[#0f172a]">
        <iframe 
          title="Interactive Scaling Visualizer"
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          srcDoc={interactiveVisualizerHtml}
        />
      </div>
    </div>
  </div>
);

const BrainTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
    <Header 
      title="The Brain (Residual MLP)" 
      subtitle="src/models/components.py -> ResidualMLP" 
      description="The intelligent core of our Coupling Layer. It observes the Context (x + u) and Half A of the targets, and learns to output the physical scaling (s) and translation (t) parameters needed to warp Half B."
    />
    
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
      {/* LEFT COLUMN: Code */}
      <Card title="The Architecture" icon={FileCode2} iconColor="text-blue-400">
        <CodeBlock language="python">{`class ResidualMLP(nn.Module):
    """
    The 'Brain' of the Coupling Layer.
    Uses GELU for smooth physics gradients and Residual skip connections.
    """
    def __init__(self, input_dim, hidden_dim, output_dim, num_layers=4):
        super().__init__()
        
        self.initial_layer = nn.Linear(input_dim, hidden_dim)
        
        # Build residual blocks
        self.blocks = nn.ModuleList([
            nn.Sequential(
                nn.Linear(hidden_dim, hidden_dim),
                nn.GELU(),
                nn.Linear(hidden_dim, hidden_dim)
            ) for _ in range(num_layers)
        ])
        
        self.activation = nn.GELU()
        
        # [STEP 2: ZERO-INIT]
        # The final layer that outputs s and t. 
        # We initialize weights and biases to EXACTLY zero.
        self.final_layer = nn.Linear(hidden_dim, output_dim)
        nn.init.zeros_(self.final_layer.weight)
        nn.init.zeros_(self.final_layer.bias)

    def forward(self, x):
        out = self.activation(self.initial_layer(x))
        
        # Pass through residual blocks (output = F(x) + x)
        for block in self.blocks:
            out = self.activation(block(out) + out)
            
        # Output random garbage initially? NO! Because of zero-init,
        # this safely outputs exactly zeros for s and t at the start.
        return self.final_layer(out)`}</CodeBlock>
      </Card>
      
      {/* RIGHT COLUMN: Explanations */}
      <div className="space-y-6 flex flex-col">
        
        {/* Explanation 1: Residual Connections */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg flex-1">
          <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center">
            <GitMerge className="w-5 h-5 mr-2 text-indigo-400" /> Design Decision: Residual Skip Connections
          </h3>
          <div className="flex gap-4">
            <div className="w-1/3 bg-gray-950 border border-gray-800 rounded p-4 flex flex-col items-center justify-center relative">
               <div className="text-indigo-400 font-mono text-sm mb-2">x</div>
               <ArrowDown className="w-4 h-4 text-gray-600 mb-1" />
               <div className="w-full bg-indigo-900/30 border border-indigo-700/50 rounded py-2 text-center text-xs text-indigo-200 z-10">F(x) Layer</div>
               <ArrowDown className="w-4 h-4 text-gray-600 mt-1" />
               
               {/* Skip Connection Line */}
               <div className="absolute left-2 top-8 bottom-8 w-6 border-l-2 border-t-2 border-b-2 border-indigo-500/50 rounded-l-lg pointer-events-none"></div>
               <ArrowRight className="absolute left-6 bottom-[1.8rem] w-3 h-3 text-indigo-500" />
               
               <div className="mt-2 text-indigo-300 font-mono font-bold text-sm bg-indigo-950 px-2 py-1 rounded border border-indigo-800 z-10">x + F(x)</div>
            </div>
            <div className="w-2/3 text-sm text-gray-300">
              <p className="mb-2">We use a <code>ModuleList</code> of <code>nn.Sequential</code> blocks, and in the forward pass we do <code>out = block(out) + out</code>.</p>
              <p><strong>Why?</strong> As we stack 6 coupling layers, the neural network becomes very deep. Gradients tend to "vanish" (shrink to zero) as they travel backwards through deep layers. Residual connections provide a "shortcut highway" for gradients, allowing deep networks to train faster and learn identity mappings instantly.</p>
            </div>
          </div>
        </div>

        {/* Explanation 2: GELU over ReLU */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg flex-1">
          <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-amber-400" /> Design Decision: GELU Activation
          </h3>
          <div className="flex gap-4 items-center">
            <div className="flex-1 text-sm text-gray-300">
              <p className="mb-2">We chose <code>nn.GELU()</code> instead of the standard <code>nn.ReLU()</code>.</p>
              <p><strong>Why?</strong> ReLU has a sharp, jagged corner at 0. This creates discontinuities in the gradients. In a physics-informed model predicting thermodynamics (pressures, temps), physical laws are smooth and continuous. GELU provides a smooth, differentiable curve, preventing "dead neurons" and leading to more stable probability density estimations.</p>
            </div>
          </div>
        </div>

        {/* Explanation 3: Zero-Initialization (Crucial!) */}
        <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-6 shadow-lg flex-1 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
          
          <h3 className="text-lg font-bold text-emerald-300 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-emerald-400" /> The Secret Sauce: Zero-Initialization
          </h3>
          
          <div className="bg-gray-950/80 border border-gray-800 rounded-lg p-4 mb-4 font-mono text-xs">
            <span className="text-purple-400">nn.init.zeros_</span>(self.final_layer.weight)<br/>
            <span className="text-purple-400">nn.init.zeros_</span>(self.final_layer.bias)
          </div>
          
          <p className="text-sm text-gray-300 mb-3">
            This is the most critical line of code in the MLP. By forcing the final layer's weights and biases to 0, the network will output exactly <code className="text-emerald-400 bg-gray-900 px-1 py-0.5 rounded">s = 0</code> and <code className="text-emerald-400 bg-gray-900 px-1 py-0.5 rounded">t = 0</code> at the very beginning of training.
          </p>
          
          <div className="bg-gray-900 border border-gray-800 rounded p-3 text-sm text-gray-200 text-center flex flex-col gap-2">
            <div>If <span className="font-mono text-purple-400">s = 0</span> and <span className="font-mono text-teal-400">t = 0</span></div>
            <div className="text-xs text-gray-500">The Affine Math becomes:</div>
            <div className="font-mono font-bold text-base bg-emerald-900/40 text-emerald-200 py-2 rounded">
              y = x · exp(<span className="text-purple-400">0</span>) + <span className="text-teal-400">0</span> &nbsp;→&nbsp; y = x
            </div>
            <div className="text-xs text-emerald-400/80 mt-1">The coupling layer starts as a perfect Identity Function!</div>
          </div>
        </div>

      </div>
    </div>
  </div>
);

const MuscleTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
    <Header 
      title="The Muscle (Conditional Affine Coupling)" 
      subtitle="src/models/components.py -> ConditionalAffineCouplingLayer" 
      description="The mechanical engine of the Normalizing Flow. This layer splits the target variables, consults the 'Brain' for instructions, and applies a reversible geometric transformation (Affine Math) while strictly tracking the change in probability volume."
    />
    
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
      {/* LEFT COLUMN: Code */}
      <Card title="The Code" icon={FileCode2} iconColor="text-blue-400">
        <CodeBlock language="python">{`class ConditionalAffineCouplingLayer(nn.Module):
    def forward(self, theta, condition):
        # 1. THE SPLIT
        # theta_1 is Half A, theta_2 is Half B
        theta_1, theta_2 = theta[:, :self.half_dim], theta[:, self.half_dim:]
        
        # 2. THE BRAIN
        # Concatenate Half A with the Context
        brain_input = torch.cat([theta_1, condition], dim=-1)
        st_params = self.brain(brain_input)
        s, t = st_params.chunk(2, dim=-1)
        
        # Physics Stability Constraint
        s = torch.tanh(s) 
        
        # 3. THE MUSCLE (AFFINE MATH)
        # Note: Half A is NOT warped here. Only theta_2!
        y_1 = theta_1
        y_2 = (theta_2 * torch.exp(s)) + t
        
        # Recombine the array for the next layer
        y_final = torch.cat([y_1, y_2], dim=-1)
        
        # 4. VOLUME PENALTY
        # The Jacobian Determinant literally simplifies to sum(s)
        log_det = s.sum(dim=-1)
        
        return y_final, log_det

    def inverse(self, z, condition):
        # EDGE HARDWARE SAMPLING (Generation)
        z_1, z_2 = z[:, :self.half_dim], z[:, self.half_dim:]
        
        # The Brain does the exact same forward pass!
        brain_input = torch.cat([z_1, condition], dim=-1)
        st_params = self.brain(brain_input)
        s, t = st_params.chunk(2, dim=-1)
        s = torch.tanh(s)
        
        # Inverse Affine Math
        theta_1 = z_1
        theta_2 = (z_2 - t) * torch.exp(-s)
        
        return torch.cat([theta_1, theta_2], dim=-1)`}</CodeBlock>
      </Card>
      
      {/* RIGHT COLUMN: Explanations */}
      <div className="space-y-6 flex flex-col">
        
        {/* Explanation 1: The Split */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg flex-1">
          <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center">
            <Scissors className="w-5 h-5 mr-2 text-rose-400" /> Phase 1: The Tactical Split
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            We slice the 8 target variables (<code className="text-rose-300">θ</code>) into two equal halves: <code className="text-rose-300">θ₁</code> and <code className="text-rose-300">θ₂</code>. 
          </p>
          <div className="flex gap-4 items-center justify-center bg-gray-950 border border-gray-800 p-4 rounded-lg mb-4">
            <div className="bg-rose-950/40 border border-rose-800/50 px-4 py-2 rounded font-mono text-rose-300 text-sm">θ₁ (4 vars)</div>
            <ArrowRight className="w-5 h-5 text-gray-600" />
            <div className="bg-gray-800 border border-gray-700 px-4 py-2 rounded font-mono text-gray-300 text-sm">Brain</div>
            <ArrowRight className="w-5 h-5 text-gray-600" />
            <div className="bg-rose-600/20 border border-rose-500/50 px-4 py-2 rounded font-mono text-rose-400 text-sm font-bold">Warp θ₂!</div>
          </div>
          <p className="text-sm text-gray-300">
            <strong>Why?</strong> Neural networks are incredibly complex and mathematically impossible to invert perfectly. By keeping <code>θ₁</code> unchanged (<code>y₁ = θ₁</code>), we can use it as a stable anchor to reverse the flow later without needing to "un-compute" the neural network.
          </p>
        </div>

        {/* Explanation 2: The Affine Transformation */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg flex-1">
          <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-indigo-400" /> Phase 2: The Affine Transformation
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            The Brain outputs <code className="text-purple-400">s</code> (scale) and <code className="text-teal-400">t</code> (translation). We apply them exclusively to shape <code className="text-rose-300">θ₂</code>.
          </p>
          <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg font-mono text-center mb-4">
            <span className="text-rose-400 font-bold">y₂</span> = (<span className="text-rose-300">θ₂</span> ⊙ exp(<span className="text-purple-400">s</span>)) + <span className="text-teal-400">t</span>
          </div>
          <p className="text-sm text-gray-300">
            <code>exp(s)</code> stretches or compresses the data geometrically, while <code>+ t</code> shifts it in space. Together, these two operations are enough to warp a simple bell curve into the complex physical footprint of SCADA data.
          </p>
        </div>

        {/* Explanation 3: Stability & Volume Penalty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-950/20 border border-amber-900/50 rounded-xl p-5 shadow-lg">
              <h3 className="text-md font-bold text-amber-400 mb-2 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2" /> Tanh Constraint
              </h3>
              <code className="text-xs text-amber-200 bg-amber-950 px-2 py-1 rounded block mb-2 font-mono">s = torch.tanh(s)</code>
              <p className="text-xs text-gray-300">
                If <code>s = 10</code>, <code>exp(10) ≈ 22,026</code>. Multiplying our data by 22k causes an instant mathematical overflow. <code>tanh()</code> bounds <code>s</code> perfectly between -1 and 1, keeping scaling safe.
              </p>
            </div>
            
            <div className="bg-fuchsia-950/20 border border-fuchsia-900/50 rounded-xl p-5 shadow-lg">
              <h3 className="text-md font-bold text-fuchsia-400 mb-2 flex items-center">
                <Activity className="w-4 h-4 mr-2" /> Jacobian Penalty
              </h3>
              <code className="text-xs text-fuchsia-200 bg-fuchsia-950 px-2 py-1 rounded block mb-2 font-mono">log_det = s.sum()</code>
              <p className="text-xs text-gray-300">
                When we stretch data by <code>exp(s)</code>, we warp its probability volume. The log of this volume change is <code>log(exp(s))</code>, which cancels out to just <code>s</code>! Summing <code>s</code> tracks the exact probability distortion.
              </p>
            </div>
        </div>
        
        {/* Explanation 4: Inverse Math */}
        <div className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6 shadow-lg flex-1">
          <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center">
            <Undo2 className="w-5 h-5 mr-2" /> Phase 3: Instant Generative Inference (Inverse)
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            When deployed on the physical pipeline, we sample random data (<code>z</code>) and run it backwards to simulate/predict future SCADA states.
          </p>
          <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg font-mono text-center text-sm mb-3 text-blue-200">
            <span className="text-rose-300">θ₂</span> = (<span className="text-rose-400">z₂</span> - <span className="text-teal-400">t</span>) ⊙ exp(-<span className="text-purple-400">s</span>)
          </div>
          <p className="text-sm text-gray-300">
            Notice we just reverse the algebra: subtract <code>t</code> and multiply by <code>exp(-s)</code>. The Brain (MLP) runs the <strong>exact same forward pass</strong> because <code>z₁ == θ₁</code>. This incredible mathematical trick allows real-time execution on edge hardware!
          </p>
        </div>

      </div>
    </div>
  </div>
);

const FlowTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
    <Header 
      title="The Wrapper (Normalizing Flow)" 
      subtitle="src/models/flow_model.py -> PipelineConditionalFlow" 
      description="The orchestrator. It stacks multiple Coupling Layers, manages the alternating dimension swaps to ensure all variables are transformed, and calculates the exact probability of the data (Log-Likelihood Loss)."
    />
    
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
      <Card title="The Architecture" icon={FileCode2} iconColor="text-blue-400">
        <CodeBlock language="python">{`class PipelineConditionalFlow(nn.Module):
    def __init__(self, dim_theta, dim_condition, num_layers=6, hidden_dim=128):
        super().__init__()
        self.dim_theta = dim_theta
        
        # Define the pre-chosen Blueprint (Standard Normal Bell Curve)
        # register_buffer ensures these stay on the Apple GPU!
        self.register_buffer('blueprint_loc', torch.zeros(dim_theta))
        self.register_buffer('blueprint_cov', torch.eye(dim_theta))
        
        # Stack multiple separate layers
        self.layers = nn.ModuleList([
            ConditionalAffineCouplingLayer(dim_theta, dim_condition, hidden_dim)
            for _ in range(num_layers)
        ])

    def get_blueprint(self):
        return MultivariateNormal(self.blueprint_loc, self.blueprint_cov)

    def forward(self, theta, condition):
        total_log_det = 0
        z = theta
        
        for layer in self.layers:
            # Pass through the Coupling Layer
            z, log_det = layer(z, condition)
            total_log_det += log_det
            
            # [STEP 3: THE SWAP]
            # Flip the tensor array entirely so Half B becomes Half A!
            z = torch.flip(z, dims=[-1])
            
        return z, total_log_det

    def compute_loss(self, theta, condition):
        # 1. Run the entire forward relay race
        z_final, total_volume_penalty = self.forward(theta, condition)
        
        # 2. Evaluate Blueprint Score (Is Z a Bell Curve?)
        blueprint = self.get_blueprint()
        blueprint_score = blueprint.log_prob(z_final)
        
        # 3. Total Loss Objective (Minimize to zero)
        loss = -1 * (blueprint_score + total_volume_penalty)
        return loss.mean()

    def sample(self, num_samples, condition):
        # Grab random clay from the Blueprint Bell Curve
        z = self.get_blueprint().sample((condition.shape[0],))
        
        # Run the relay race BACKWARD through the layers
        for layer in reversed(self.layers):
            z = torch.flip(z, dims=[-1]) # Undo the flip first!
            z = layer.inverse(z, condition)
            
        return z`}</CodeBlock>
      </Card>
      
      <div className="space-y-6 flex flex-col">
        
        {/* Explanation 1: The Blueprint */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-emerald-400" /> 1. The Blueprint (Base Distribution)
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            The Flow works by warping messy SCADA data into a perfect, multi-dimensional bell curve. We define this "target" blueprint using <code className="text-emerald-400 bg-gray-950 px-1 py-0.5 rounded">MultivariateNormal</code>.
          </p>
          <div className="flex gap-4 items-center">
             <div className="bg-gray-950 border border-gray-800 p-3 rounded-lg flex-1">
               <span className="text-xs text-gray-400 block mb-1">Mean (Loc)</span>
               <code className="text-sm text-emerald-300">torch.zeros()</code>
             </div>
             <div className="bg-gray-950 border border-gray-800 p-3 rounded-lg flex-1">
               <span className="text-xs text-gray-400 block mb-1">Covariance</span>
               <code className="text-sm text-emerald-300">torch.eye()</code>
             </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 italic">
            * Note: We use <code>register_buffer</code> so PyTorch knows to move these target tensors to the M4 Max GPU alongside the model weights.
          </p>
        </div>

        {/* Explanation 2: The Swap */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center">
            <ArrowLeftRight className="w-5 h-5 mr-2 text-indigo-400" /> 2. The Relay Race & The Swap
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            If we stack 6 layers without swapping, <code className="text-rose-300">θ₁</code> never gets warped. To ensure all variables are transformed, we flip the array after every layer.
          </p>
          
          <div className="flex items-center justify-between bg-gray-950 border border-gray-800 p-4 rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-400">Layer <span className="font-bold text-white">N</span> Output</span>
              <div className="flex">
                <div className="bg-rose-950/50 border border-rose-800 px-3 py-1 rounded-l text-rose-300 text-xs">θ₁</div>
                <div className="bg-rose-600/30 border border-rose-500 px-3 py-1 rounded-r text-rose-100 text-xs">Warped θ₂</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-indigo-900/50 border border-indigo-700 p-2 rounded-full mb-1">
                <RefreshCw className="w-4 h-4 text-indigo-300" />
              </div>
              <span className="text-[10px] text-indigo-400 font-mono">torch.flip()</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-400">Layer <span className="font-bold text-white">N+1</span> Input</span>
              <div className="flex">
                <div className="bg-rose-950/50 border border-rose-800 px-3 py-1 rounded-l text-rose-300 text-xs">Warped θ₂</div>
                <div className="bg-rose-600/30 border border-rose-500 px-3 py-1 rounded-r text-rose-100 text-xs">θ₁</div>
              </div>
            </div>
          </div>
        </div>

        {/* Explanation 3: Loss */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center">
            <Sigma className="w-5 h-5 mr-2 text-rose-400" /> 3. Negative Log-Likelihood Loss
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            How do we know if the model is learning? We pass the data through the flow and ask the Blueprint: <i>"How closely does this warped data resemble a perfect bell curve?"</i>
          </p>
          <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg font-mono text-center text-sm">
            <span className="text-rose-400 font-bold">Loss</span> = -1 * (<span className="text-blue-400">blueprint.log_prob(Z)</span> + <span className="text-fuchsia-400">total_volume_penalty</span>)
          </div>
          <p className="text-xs text-gray-500 mt-4">
            By minimizing this loss, PyTorch adjusts the Brain's weights until the Flow perfectly morphs SCADA data into a Gaussian distribution.
          </p>
        </div>

        {/* Explanation 4: Inference */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center">
            <Cpu className="w-5 h-5 mr-2 text-amber-400" /> 4. Edge Inference & Sampling
          </h3>
          <p className="text-sm text-gray-300">
            The <code>sample()</code> function is used for deployment. We take pure noise from the Blueprint, inject the current SCADA context (Controls + Environment), and run the layers <strong>in reverse</strong>. The output is a perfectly simulated prediction of what the pipeline will do next!
          </p>
        </div>

      </div>
    </div>
  </div>
);

const TrainerTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
    <Header 
      title="The Trainer & Evaluation Loop" 
      subtitle="src/training/trainer.py -> SMPCTrainer" 
      description="The master control loop. It manages the AdamW optimizer, orchestrates the forward and backward gradient passes, integrates Apple Metal acceleration, and critically relies on a Validation loop to prevent the model from memorizing the data."
    />
    
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
      {/* LEFT COLUMN: Code */}
      <Card title="The Trainer Logic" icon={FileCode2} iconColor="text-blue-400">
        <CodeBlock language="python">{`class SMPCTrainer:
    def __init__(self, model, train_loader, val_loader, lr=1e-3, epochs=50, device="mps", log_to_wandb=False):
        # Move the model to the Apple Metal GPU
        self.model = model.to(device)
        self.optimizer = AdamW(self.model.parameters(), lr=lr, weight_decay=1e-4)
        
        self.best_val_loss = float('inf') # Track best performance
        self.log_to_wandb = log_to_wandb

    def train(self):
        for epoch in range(1, self.epochs + 1):
            
            # --- TRAINING PHASE ---
            self.model.train() # Turn on gradient tracking & dropout
            
            # tqdm adds a progress bar to terminal
            for batch in tqdm(self.train_dataloader):
                theta, condition = batch['theta'].to(self.device), batch['condition'].to(self.device)
                
                # 1. Zero out old gradients
                self.optimizer.zero_grad()
                # 2. Forward pass to get loss
                loss = self.model.compute_loss(theta, condition)
                # 3. Calculate gradients backward through the network
                loss.backward()
                # 4. Update the neural network weights
                self.optimizer.step()
                
            # --- VALIDATION PHASE ---
            avg_val_loss = self.evaluate(epoch)
            
            if self.log_to_wandb:
                wandb.log({"epoch": epoch, "train_loss": avg_train_loss, "val_loss": avg_val_loss})
            
            # Save the "Best" model based on unseen validation data
            if avg_val_loss < self.best_val_loss:
                self.best_val_loss = avg_val_loss
                self.save_checkpoint(epoch, is_best=True)
            elif epoch % 10 == 0:
                self.save_checkpoint(epoch) # Periodic backup

    def evaluate(self, epoch):
        self.model.eval() # Turn off training features
        
        with torch.no_grad(): # Disable physics gradient tracking
            for batch in self.val_dataloader:
                theta, condition = batch['theta'].to(self.device), batch['condition'].to(self.device)
                loss = self.model.compute_loss(theta, condition)
                
        return epoch_val_loss / len(self.val_dataloader)`}</CodeBlock>
      </Card>
      
      {/* RIGHT COLUMN: Explanations */}
      <div className="space-y-6 flex flex-col">
        
        {/* Explanation 1: Hardware & MLOps */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg flex-1">
          <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center">
            <Cpu className="w-5 h-5 mr-2 text-blue-400" /> 1. Hardware & MLOps Integration
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-950 border border-gray-800 p-4 rounded-lg flex flex-col">
              <span className="text-sm font-bold text-blue-300 mb-2 flex items-center"><Zap className="w-4 h-4 mr-1"/> device="mps"</span>
              <p className="text-xs text-gray-400">Moves matrices from the CPU to the Apple M4 Max Metal GPU. Crucial for parallelizing the dense matrix multiplications inside our MLPs.</p>
            </div>
            <div className="bg-gray-950 border border-gray-800 p-4 rounded-lg flex flex-col">
              <span className="text-sm font-bold text-amber-300 mb-2 flex items-center"><Cloud className="w-4 h-4 mr-1"/> wandb.log()</span>
              <p className="text-xs text-gray-400">Streams training metrics (loss curves) live to Weights & Biases cloud dashboards, letting you monitor training from anywhere.</p>
            </div>
          </div>
        </div>

        {/* Explanation 2: The Optimization Cycle */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg flex-1">
          <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center">
            <RefreshCw className="w-5 h-5 mr-2 text-indigo-400" /> 2. The PyTorch Backprop Cycle
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            During the Training Phase, PyTorch loops through 4 critical, sequential steps for every single batch of SCADA data:
          </p>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg flex items-center gap-3">
              <div className="bg-slate-800 text-slate-400 font-bold px-2 py-1 rounded">1</div>
              <div className="text-xs font-mono text-indigo-300 break-words w-full">.zero_grad()</div>
            </div>
            <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg flex items-center gap-3">
              <div className="bg-slate-800 text-slate-400 font-bold px-2 py-1 rounded">2</div>
              <div className="text-xs font-mono text-rose-300 break-words w-full">.compute_loss()</div>
            </div>
            <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg flex items-center gap-3">
              <div className="bg-slate-800 text-slate-400 font-bold px-2 py-1 rounded">3</div>
              <div className="text-xs font-mono text-emerald-300 break-words w-full">loss.backward()</div>
            </div>
            <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg flex items-center gap-3">
              <div className="bg-slate-800 text-slate-400 font-bold px-2 py-1 rounded">4</div>
              <div className="text-xs font-mono text-amber-300 break-words w-full">.step()</div>
            </div>
          </div>
          
          <p className="text-xs text-gray-400">
            <strong>Why AdamW?</strong> We use the AdamW optimizer. It includes <code>weight_decay</code> (L2 regularization), which gently penalizes the MLP for relying too heavily on any single feature, pushing the network to learn robust, generalized thermodynamics rather than brittle rules.
          </p>
        </div>

        {/* Explanation 3: Evaluation Mode */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg flex-1">
          <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center">
            <ShieldAlert className="w-5 h-5 mr-2 text-rose-400" /> 3. Validation & Gradient Freezing
          </h3>
          <p className="text-sm text-gray-300 mb-3">
            In <code>evaluate()</code>, we do two very specific things before passing the unseen Validation data through the model:
          </p>
          <ul className="text-sm text-gray-300 space-y-3 mb-2">
            <li className="flex items-start gap-2">
              <div className="bg-gray-800 rounded p-1 text-rose-400 mt-0.5"><RotateCcw className="w-3 h-3" /></div>
              <span><strong>model.eval():</strong> Tells layers to switch from "learning mode" to "locked production mode".</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-gray-800 rounded p-1 text-rose-400 mt-0.5"><Activity className="w-3 h-3" /></div>
              <span><strong>with torch.no_grad():</strong> PyTorch normally records every math operation in memory to calculate derivatives later. This flag turns that off, slashing memory usage by 50% and doubling execution speed.</span>
            </li>
          </ul>
        </div>

        {/* Explanation 4: Early Stopping & Overfitting */}
        <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-6 shadow-lg flex-1">
          <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2" /> 4. Beating Overfitting (Best Model Save)
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            A model that memorizes the training data is useless in production. We track the <code>best_val_loss</code> to capture the model right before it starts overfitting.
          </p>
          
          {/* CSS based Chart Visualization */}
          <div className="bg-gray-950 border border-gray-800 h-32 rounded-lg relative overflow-hidden mb-4 p-4 flex items-end">
             {/* Y-axis line */}
             <div className="absolute left-6 top-4 bottom-4 w-px bg-gray-700"></div>
             {/* X-axis line */}
             <div className="absolute left-6 bottom-4 right-4 h-px bg-gray-700"></div>
             
             {/* Train Line (keeps going down) */}
             <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M 10,20 Q 40,60 90,85" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
                {/* Val Line (goes down, then up) */}
                <path d="M 10,25 Q 30,55 50,70 T 90,40" fill="none" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
                {/* Best Checkpoint Star */}
                <circle cx="50" cy="70" r="3" fill="#fbbf24" className="animate-pulse" />
                <line x1="50" y1="70" x2="50" y2="90" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" />
             </svg>
             
             <div className="absolute left-10 bottom-1 text-[10px] text-gray-500 font-mono">Epochs</div>
             <div className="absolute left-[45%] bottom-1 text-[10px] text-amber-400 font-bold font-mono text-center leading-none">
               Best<br/>Saved
             </div>
          </div>
          
          <div className="flex gap-4 text-xs font-mono mt-2 justify-center">
            <div className="flex items-center text-blue-400"><div className="w-3 h-0.5 bg-blue-400 mr-2"></div> Train Loss</div>
            <div className="flex items-center text-orange-400"><div className="w-3 h-0.5 bg-orange-400 mr-2"></div> Val Loss</div>
          </div>
        </div>

      </div>
    </div>
  </div>
);

const projectMap = [
  { id: 'genesis', type: 'folder', name: 'GENESIS/', indent: 0, icon: FolderTree, color: 'text-gray-300', desc: 'Root repository containing the entire SCADA Normalizing Flow project.' },
  { id: 'configs', type: 'folder', name: 'configs/', indent: 1, icon: FolderTree, color: 'text-yellow-500', desc: 'Configuration directory for managing hyperparameters, model sizes, and dataset paths (e.g., using Hydra/YAML) without hardcoding them.' },
  { id: 'data', type: 'folder', name: 'data/', indent: 1, icon: FolderTree, color: 'text-blue-400', desc: 'Local data storage. Git-ignored to prevent accidentally committing massive datasets to version control.' },
  { id: 'data-raw', type: 'file', name: 'raw/DataAllParts.xlsx', indent: 2, icon: Database, color: 'text-green-500', desc: 'The original 1-million row Emerson SCADA export. (Best practice: convert to .csv to dramatically optimize Pandas loading speed into M4 Unified Memory).' },
  { id: 'outputs', type: 'folder', name: 'outputs/', indent: 1, icon: FolderTree, color: 'text-orange-400', desc: 'Generated artifacts, logs, and state dictionaries from training runs.' },
  { id: 'out-chk', type: 'folder', name: 'checkpoints/', indent: 2, icon: Save, color: 'text-orange-300', desc: 'Saved PyTorch model weights (model_best.pt) and the fitted Z-score scaler (scaler.pt). Crucial for deploying the trained model to edge devices.' },
  { id: 'out-img', type: 'folder', name: 'images/', indent: 2, icon: Save, color: 'text-orange-300', desc: 'Generated visualization plots tracking the before-and-after Z-score transformations to verify data sanity.' },
  { id: 'scripts', type: 'folder', name: 'scripts/', indent: 1, icon: FolderTree, color: 'text-yellow-500', desc: 'Executable entry points for the pipeline. These are the scripts you actually run from the terminal.' },
  { id: 'train-py', type: 'file', name: 'train.py', indent: 2, icon: FileCode2, color: 'text-blue-400', desc: 'The main conductor script. Initializes the Train/Val datasets, dynamically sizes the Flow architecture, and ignites the SMPCTrainer.' },
  { id: 'src', type: 'folder', name: 'src/', indent: 1, icon: FolderTree, color: 'text-emerald-500', desc: 'The core source code of the machine learning pipeline. Separated by domain logic.' },
  { id: 'src-data', type: 'folder', name: 'data/', indent: 2, icon: FolderTree, color: 'text-emerald-400', desc: 'Data ingestion and preprocessing logic.' },
  { id: 'dataset-py', type: 'file', name: 'dataset.py', indent: 3, icon: FileCode2, color: 'text-blue-400', desc: 'Loads SCADA data into RAM, partitions into Context (X), Controls (U), and Targets (Theta). Applies Z-score scaling strictly without data leakage, and exports the scaler.' },
  { id: 'src-models', type: 'folder', name: 'models/', indent: 2, icon: FolderTree, color: 'text-emerald-400', desc: 'Neural network architectures and mathematical layers.' },
  { id: 'components-py', type: 'file', name: 'components.py', indent: 3, icon: FileCode2, color: 'text-blue-400', desc: 'Contains the ResidualMLP (the "Brain") and ConditionalAffineCouplingLayer (the "Muscle") utilizing strict Zero-Initialization for stable gradients.' },
  { id: 'flow-py', type: 'file', name: 'flow_model.py', indent: 3, icon: FileCode2, color: 'text-blue-400', desc: 'Wraps the coupling layers, handles the dimension swapping (torch.flip) to ensure all features are warped, and calculates the final Log-Likelihood loss.' },
  { id: 'src-training', type: 'folder', name: 'training/', indent: 2, icon: FolderTree, color: 'text-emerald-400', desc: 'Training loops, evaluation logic, and optimization strategies.' },
  { id: 'trainer-py', type: 'file', name: 'trainer.py', indent: 3, icon: FileCode2, color: 'text-blue-400', desc: 'Manages the AdamW optimizer, handles the split Train/Val phases, tracks loss convergence via W&B, and auto-saves the best generalized model to disk.' },
  { id: 'req', type: 'file', name: 'requirements.txt', indent: 1, icon: FileCode2, color: 'text-gray-400', desc: 'Lists Python dependencies (PyTorch, pandas, wandb, openpyxl) to guarantee exact environment replication across different machines.' },
];

const StructureTab = () => {
  const [selectedNode, setSelectedNode] = useState(projectMap[0]);
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <Header title="Project Structure" subtitle="Interactive GENESIS Repository Map" />
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Tree View Panel */}
        <div className="lg:col-span-3 bg-gray-900 border border-gray-800 rounded-xl py-6 px-4 shadow-2xl h-[550px] overflow-y-auto scrollbar-thin">
          <div className="font-mono text-sm text-gray-300 space-y-1">
            {projectMap.map((node) => (
              <TreeItem 
                key={node.id} 
                node={node} 
                isActive={selectedNode.id === node.id}
                onClick={setSelectedNode}
              />
            ))}
          </div>
        </div>
        
        {/* Details Panel */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl h-[550px] flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none"></div>
          
          <div className="flex items-center gap-4 mb-6 z-10">
            <div className={`p-4 rounded-xl bg-slate-800 border border-slate-600 shadow-inner flex-shrink-0`}>
            {(() => {
                const Icon = selectedNode.icon;
                return <Icon className={`w-8 h-8 ${selectedNode.color}`} />;
            })()}
            </div>
            <div>
              <h3 className="text-lg font-mono font-bold text-gray-100 break-all leading-tight">{selectedNode.name}</h3>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{selectedNode.type}</span>
            </div>
          </div>
          
          <div className="flex-1 bg-slate-950/50 border border-slate-800 rounded-lg p-5 z-10 shadow-inner">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-blue-400" />
              <h4 className="text-sm font-bold text-gray-200">Module Purpose</h4>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {selectedNode.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- UTILS ---

const Header = ({ title, subtitle, description }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-100">{title}</h2>
    <p className="text-gray-400 font-mono text-sm mt-1">{subtitle}</p>
    {description && <p className="text-gray-400 mt-4 max-w-4xl">{description}</p>}
  </div>
);

const Card = ({ title, icon: Icon, iconColor, children }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
    <div className="bg-gray-800/50 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
        <span className="text-xs font-mono font-bold text-gray-300 tracking-wide">{title}</span>
      </div>
      <div className="flex gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
      </div>
    </div>
    <div className="p-4 flex-1 overflow-auto bg-[#0d1117]">
      {children}
    </div>
  </div>
);

const CodeBlock = ({ language, children }) => (
  <pre className="font-mono text-xs text-gray-300 leading-relaxed overflow-x-auto h-full scrollbar-thin">
    <code>{children}</code>
  </pre>
);

const TreeItem = ({ node, isActive, onClick }) => {
  const { icon: Icon, name, indent, color } = node;
  return (
    <div 
      onClick={() => onClick(node)}
      className={`flex items-center py-1.5 px-3 cursor-pointer rounded transition-colors duration-200 ${isActive ? 'bg-blue-900/40 border border-blue-800/50 shadow-sm' : 'hover:bg-gray-800/60 border border-transparent'}`} 
      style={{ marginLeft: `${indent * 24}px` }}
    >
      {indent === 0 ? (
        <ArrowDown className="w-4 h-4 mr-2 text-gray-500" />
      ) : (
        <div className="w-4 h-full border-l border-b border-gray-700 mr-2 rounded-bl opacity-50 relative -top-2"></div>
      )}
      <Icon className={`w-4 h-4 mr-2 flex-shrink-0 ${color}`} />
      <span className={`truncate ${indent === 0 ? 'font-bold text-gray-200' : 'text-gray-300'} ${isActive ? 'font-medium text-blue-300' : ''}`}>
        {name}
      </span>
    </div>
  );
};

const interactiveVisualizerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Normalizing Flow Visualizer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #e2e8f0; margin: 0; padding: 0; }
        canvas { background-color: #1e293b; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); width: 100%; height: 100%;}
        .step-active { border-left: 4px solid #3b82f6; background-color: #1e293b; }
        .step-inactive { border-left: 4px solid transparent; opacity: 0.6; cursor: pointer; transition: opacity 0.2s; }
        .step-inactive:hover { opacity: 1; }
        .scroller::-webkit-scrollbar { width: 6px; }
        .scroller::-webkit-scrollbar-track { background: #0f172a; }
        .scroller::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
    </style>
</head>
<body class="h-screen w-full flex flex-col overflow-hidden">
    <header class="bg-slate-900 border-b border-slate-700 p-4 shrink-0">
        <h1 class="text-xl font-bold text-white flex items-center gap-2">
            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
            FlowScaling Explainer
        </h1>
        <p class="text-sm text-slate-400 mt-1">Interactive visualizations of Z-Score normalization, leakage, and Jacobian volume changes.</p>
    </header>
    <div class="flex-1 flex overflow-hidden">
        <div class="w-1/3 bg-slate-800 border-r border-slate-700 flex flex-col h-full scroller overflow-y-auto pb-12">
            <div id="step-0" class="p-6 step-active transition-all" onclick="setStep(0)">
                <h2 class="text-lg font-bold text-white mb-2">1. The Raw Data</h2>
                <p class="text-sm text-slate-300 mb-4">In the real world, your data features have arbitrary means and variances. Neural nets struggle to learn from unscaled data.</p>
                <button onclick="generateData(); setStep(0, true);" class="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded text-sm transition">Regenerate Raw Data</button>
            </div>
            <div id="step-1" class="p-6 step-inactive transition-all" onclick="setStep(1)">
                <h2 class="text-lg font-bold text-white mb-2">2. Mean Centering</h2>
                <code class="block bg-slate-900 p-2 rounded text-xs text-green-400 mb-3 font-mono">raw_x - np.mean(raw_x)</code>
                <p class="text-sm text-slate-300">The first step is shifting the data so it revolves around the origin (0, 0).</p>
            </div>
            <div id="step-2" class="p-6 step-inactive transition-all" onclick="setStep(2)">
                <h2 class="text-lg font-bold text-white mb-2">3. Scaling to Std=1</h2>
                <code class="block bg-slate-900 p-2 rounded text-xs text-green-400 mb-3 font-mono">... / np.std(raw_x)</code>
                <p class="text-sm text-slate-300">By dividing by standard deviation, we ensure the data's "spread" is 1.0. This creates a perfect spherical cluster similar to the Base Distribution.</p>
            </div>
            <div id="step-3" class="p-6 step-inactive transition-all" onclick="setStep(3)">
                <h2 class="text-lg font-bold text-white mb-2">4. The Epsilon (+ 1e-8)</h2>
                <code class="block bg-slate-900 p-2 rounded text-xs text-green-400 mb-3 font-mono">... / (np.std + 1e-8)</code>
                <p class="text-sm text-slate-300 mb-4">If a feature is constant, its standard deviation is 0. Dividing by zero causes a crash. Watch what happens to "Flat Data".</p>
                <div class="flex gap-2">
                    <button id="btn-no-eps" onclick="demonstrateEpsilon(false)" class="flex-1 bg-red-900 hover:bg-red-800 text-white text-xs font-medium py-2 rounded transition">Without 1e-8 (Crash)</button>
                    <button id="btn-yes-eps" onclick="demonstrateEpsilon(true)" class="flex-1 bg-blue-700 hover:bg-blue-600 text-white text-xs font-medium py-2 rounded transition">With 1e-8 (Safe)</button>
                </div>
            </div>
            <div id="step-4" class="p-6 step-inactive transition-all" onclick="setStep(4)">
                <h2 class="text-lg font-bold text-white mb-2">5. Data Leakage (Production)</h2>
                <p class="text-sm text-slate-300 mb-4">If you evaluate new "Test Data" (orange), you <b>must</b> scale it using the exact Mean/Std saved from the Training Data (blue). Using its own stats biases the model!</p>
                <div class="flex flex-col gap-2">
                    <button onclick="simulateProduction('correct')" class="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium py-2 rounded transition">Correct: Apply Train Stats</button>
                    <button onclick="simulateProduction('leakage')" class="bg-orange-700 hover:bg-orange-600 text-white text-xs font-medium py-2 rounded transition">Leakage: Use Test's Stats</button>
                </div>
            </div>
            <div id="step-5" class="p-6 step-inactive transition-all" onclick="setStep(5)">
                <h2 class="text-lg font-bold text-white mb-2">6. ⚠️ The Missing Jacobian</h2>
                <p class="text-sm text-slate-300 mb-4">Normalizing flows track probability volume. Look at the bounding box. When you divide by std, the geometric area changes.</p>
                <div class="bg-slate-900 p-3 rounded mb-4">
                    <div class="text-xs text-slate-400">Area of 1 standard deviation:</div>
                    <div id="jacobian-area" class="text-lg font-mono text-fuchsia-400">100.00 units²</div>
                </div>
                <p class="text-sm text-slate-300 text-yellow-300/90">If you scale data <b>before</b> it enters the Flow, the model doesn't know the volume changed! It computes log-likelihood on the <i>scaled</i> area, not the <i>original</i>. This is why this logic usually lives inside an <code>ActNorm</code> flow layer.</p>
            </div>
        </div>
        <div class="w-2/3 p-4 relative h-full bg-[#0f172a]">
            <div class="absolute top-6 left-6 flex gap-4 pointer-events-none z-10">
                <div class="bg-slate-800/80 backdrop-blur border border-slate-700 p-3 rounded-lg shadow-lg">
                    <h3 class="text-xs text-slate-400 uppercase tracking-wide font-bold mb-1">Current State</h3>
                    <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm font-mono">
                        <span class="text-slate-300">Mean X:</span> <span id="stat-mean-x" class="text-white text-right">0.00</span>
                        <span class="text-slate-300">Mean Y:</span> <span id="stat-mean-y" class="text-white text-right">0.00</span>
                        <span class="text-slate-300">Std X:</span> <span id="stat-std-x" class="text-white text-right">1.00</span>
                        <span class="text-slate-300">Std Y:</span> <span id="stat-std-y" class="text-white text-right">1.00</span>
                    </div>
                </div>
            </div>
            <canvas id="vizCanvas"></canvas>
        </div>
    </div>
    <script>
        const canvas = document.getElementById('vizCanvas');
        const ctx = canvas.getContext('2d');
        let width, height;

        function resize() {
            width = canvas.parentElement.clientWidth - 32;
            height = canvas.parentElement.clientHeight - 32;
            canvas.width = width;
            canvas.height = height;
        }
        window.addEventListener('resize', resize);
        resize();

        function randomGaussian(mean = 0, std = 1) {
            let u = 1 - Math.random();
            let v = Math.random();
            let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            return z * std + mean;
        }

        let points = [];
        let testPoints = [];
        let currentStep = 0;
        let trainStats = { mx: 0, my: 0, sx: 1, sy: 1 };
        let testStats = { mx: 0, my: 0, sx: 1, sy: 1 };
        let origTrainStats = { mx: 0, my: 0, sx: 1, sy: 1 };
        const SCALE = 40; 

        function generateData() {
            points = [];
            testPoints = [];
            const biasX = (Math.random() * 8) - 4;
            const biasY = (Math.random() * 8) - 4;
            const spreadX = (Math.random() * 3) + 1.5;
            const spreadY = (Math.random() * 3) + 0.5;

            for (let i = 0; i < 250; i++) {
                let rY = randomGaussian(biasY, spreadY);
                points.push({
                    rawX: randomGaussian(biasX, spreadX),
                    rawY: rY, origRawY: rY,
                    x: 0, y: 0, tgtX: 0, tgtY: 0,
                    isTest: false, isCrash: false
                });
            }
            
            trainStats.mx = points.reduce((s, p) => s + p.rawX, 0) / points.length;
            trainStats.my = points.reduce((s, p) => s + p.rawY, 0) / points.length;
            trainStats.sx = Math.sqrt(points.reduce((s, p) => s + Math.pow(p.rawX - trainStats.mx, 2), 0) / points.length);
            trainStats.sy = Math.sqrt(points.reduce((s, p) => s + Math.pow(p.rawY - trainStats.my, 2), 0) / points.length);

            const testBiasX = biasX + 2; 
            const testBiasY = biasY - 1;
            for (let i = 0; i < 50; i++) {
                testPoints.push({
                    rawX: randomGaussian(testBiasX, spreadX * 0.8),
                    rawY: randomGaussian(testBiasY, spreadY * 1.2),
                    x: 0, y: 0, tgtX: 0, tgtY: 0,
                    isTest: true, isCrash: false
                });
            }
            testStats.mx = testPoints.reduce((s, p) => s + p.rawX, 0) / testPoints.length;
            testStats.my = testPoints.reduce((s, p) => s + p.rawY, 0) / testPoints.length;
            testStats.sx = Math.sqrt(testPoints.reduce((s, p) => s + Math.pow(p.rawX - testStats.mx, 2), 0) / testPoints.length);
            testStats.sy = Math.sqrt(testPoints.reduce((s, p) => s + Math.pow(p.rawY - testStats.my, 2), 0) / testPoints.length);

            origTrainStats = { ...trainStats };
            points.forEach(p => { p.x = p.tgtX = p.rawX; p.y = p.tgtY = p.rawY; });
            testPoints.forEach(p => { p.x = p.tgtX = p.rawX; p.y = p.tgtY = p.rawY; });
            updateTargetsForStep(currentStep);
        }

        function setStep(stepIndex, force=false) {
            if (currentStep === stepIndex && !force) return;
            currentStep = stepIndex;
            for(let i=0; i<=5; i++) {
                const el = document.getElementById('step-'+i);
                if (i === stepIndex) {
                    el.classList.add('step-active'); el.classList.remove('step-inactive');
                } else {
                    el.classList.add('step-inactive'); el.classList.remove('step-active');
                }
            }
            updateTargetsForStep(stepIndex);
        }

        function updateTargetsForStep(step) {
            points.forEach(p => p.isCrash = false);
            testPoints.forEach(p => p.isCrash = false);
            points.forEach(p => { if (p.origRawY !== undefined) p.rawY = p.origRawY; });
            trainStats.my = origTrainStats.my;
            trainStats.sy = origTrainStats.sy;

            if (step === 0) {
                points.forEach(p => { p.tgtX = p.rawX; p.tgtY = p.rawY; });
            } else if (step === 1) {
                points.forEach(p => { p.tgtX = p.rawX - trainStats.mx; p.tgtY = p.rawY - trainStats.my; });
            } else if (step === 2 || step === 5) {
                points.forEach(p => { 
                    p.tgtX = (p.rawX - trainStats.mx) / trainStats.sx; 
                    p.tgtY = (p.rawY - trainStats.my) / trainStats.sy; 
                });
            } else if (step === 3) {
                points.forEach(p => { p.rawY = 3.0; });
                trainStats.my = 3.0; trainStats.sy = 0.0;
                points.forEach(p => { p.tgtX = p.rawX; p.tgtY = p.rawY; });
            } else if (step === 4) {
                points.forEach(p => { 
                    p.tgtX = (p.rawX - trainStats.mx) / trainStats.sx; 
                    p.tgtY = (p.rawY - trainStats.my) / trainStats.sy; 
                });
                testPoints.forEach(p => { p.tgtX = p.rawX; p.tgtY = p.rawY; });
            }
        }

        function demonstrateEpsilon(useEps) {
            setStep(3, true);
            const eps = useEps ? 1e-8 : 0;
            points.forEach(p => {
                p.tgtX = (p.rawX - trainStats.mx) / trainStats.sx;
                if (!useEps) {
                    p.tgtY = 0; 
                    p.isCrash = true;
                } else {
                    p.tgtY = (p.rawY - trainStats.my) / eps; 
                    p.isCrash = false;
                }
            });
        }

        function simulateProduction(mode) {
            setStep(4, true);
            if (mode === 'correct') {
                testPoints.forEach(p => { 
                    p.tgtX = (p.rawX - trainStats.mx) / trainStats.sx; 
                    p.tgtY = (p.rawY - trainStats.my) / trainStats.sy; 
                });
            } else {
                testPoints.forEach(p => { 
                    p.tgtX = (p.rawX - testStats.mx) / testStats.sx; 
                    p.tgtY = (p.rawY - testStats.my) / testStats.sy; 
                });
            }
        }

        function toPixel(valX, valY) {
            return { x: (valX * SCALE) + width/2, y: height/2 - (valY * SCALE) };
        }

        function drawGrid() {
            ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
            const origin = toPixel(0, 0);
            for(let i = 0; i < width; i += SCALE) {
                ctx.beginPath();
                ctx.moveTo(origin.x + (i * SCALE), 0); ctx.lineTo(origin.x + (i * SCALE), height);
                ctx.moveTo(origin.x - (i * SCALE), 0); ctx.lineTo(origin.x - (i * SCALE), height);
                ctx.stroke();
            }
            for(let i = 0; i < height; i += SCALE) {
                ctx.beginPath();
                ctx.moveTo(0, origin.y + (i * SCALE)); ctx.lineTo(width, origin.y + (i * SCALE));
                ctx.moveTo(0, origin.y - (i * SCALE)); ctx.lineTo(width, origin.y - (i * SCALE));
                ctx.stroke();
            }
            ctx.strokeStyle = '#475569'; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, origin.y); ctx.lineTo(width, origin.y);
            ctx.moveTo(origin.x, 0); ctx.lineTo(origin.x, height);
            ctx.stroke();
        }

        function getLiveStats(dataArray) {
            if (dataArray.length === 0) return { mx:0, my:0, sx:1, sy:1 };
            const mx = dataArray.reduce((s, p) => s + p.x, 0) / dataArray.length;
            const my = dataArray.reduce((s, p) => s + p.y, 0) / dataArray.length;
            const sx = Math.sqrt(dataArray.reduce((s, p) => s + Math.pow(p.x - mx, 2), 0) / dataArray.length);
            const sy = Math.sqrt(dataArray.reduce((s, p) => s + Math.pow(p.y - my, 2), 0) / dataArray.length);
            return {mx, my, sx, sy};
        }

        function loop() {
            ctx.clearRect(0, 0, width, height);
            drawGrid();

            let allPoints = points;
            if (currentStep === 4) allPoints = points.concat(testPoints); 

            allPoints.forEach(p => {
                if (p.isCrash) {
                    p.x += (Math.random() - 0.5) * 50;
                    p.y += (Math.random() - 0.5) * 50;
                } else {
                    p.x += (p.tgtX - p.x) * 0.1; 
                    p.y += (p.tgtY - p.y) * 0.1;
                }
            });

            const live = getLiveStats(points);
            document.getElementById('stat-mean-x').innerText = live.mx.toFixed(2);
            document.getElementById('stat-mean-y').innerText = live.my.toFixed(2);
            document.getElementById('stat-std-x').innerText = live.sx.toFixed(2);
            document.getElementById('stat-std-y').innerText = live.sy.toFixed(2);

            if (currentStep === 5 || currentStep === 2 || currentStep === 1 || currentStep === 0) {
                const px1 = toPixel(live.mx - live.sx, live.my + live.sy);
                const px2 = toPixel(live.mx + live.sx, live.my - live.sy);
                
                ctx.fillStyle = currentStep === 5 ? 'rgba(217, 70, 239, 0.2)' : 'rgba(59, 130, 246, 0.1)';
                ctx.strokeStyle = currentStep === 5 ? 'rgba(217, 70, 239, 0.8)' : 'rgba(59, 130, 246, 0.5)';
                ctx.lineWidth = 2;
                
                const boxWidth = px2.x - px1.x;
                const boxHeight = px2.y - px1.y;
                ctx.fillRect(px1.x, px1.y, boxWidth, boxHeight);
                ctx.strokeRect(px1.x, px1.y, boxWidth, boxHeight);

                const area = (live.sx * 2) * (live.sy * 2);
                document.getElementById('jacobian-area').innerText = area.toFixed(2) + " units²";
            }

            allPoints.forEach(p => {
                const px = toPixel(p.x, p.y);
                ctx.beginPath();
                ctx.arc(px.x, px.y, 4, 0, Math.PI * 2);
                
                if (p.isCrash) ctx.fillStyle = '#ef4444'; 
                else if (p.isTest) ctx.fillStyle = '#f97316'; 
                else ctx.fillStyle = '#60a5fa'; 
                
                ctx.fill();
            });

            requestAnimationFrame(loop);
        }

        generateData();
        setStep(0);
        loop();
    </script>
</body>
</html>`;

export default ScadaExplorer;