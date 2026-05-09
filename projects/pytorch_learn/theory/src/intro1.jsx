import React, { useState } from 'react';
import { 
  Layers, Box, Cpu, Zap, ArrowRight, Database, Network, Activity, 
  GitBranch, ChevronRight, ChevronLeft, Code, Terminal, 
  CheckCircle2, PlusSquare, Calculator, AlertTriangle, ArrowLeftRight, 
  LineChart, Play, Scissors 
} from 'lucide-react';

import IntroSection from './sections/IntroSection';
import DimensionsSection from './sections/DimensionsSection';
import DeepLearningSection from './sections/DeepLearningSection';
import WhyPyTorchSection from './sections/WhyPyTorchSection';
import CreationSection from './sections/CreationSection';
import OperationsSection from './sections/OperationsSection';
import NumpySection from './sections/NumpySection';
import IndexingSection from './sections/IndexingSection';
import ReshapeSection from './sections/ReshapeSection';
import JoinSplitSection from './sections/JoinSplitSection';
import BroadcastSection from './sections/BroadcastSection';
import DataTypeSection from './sections/DataTypeSection';
import CpuGpuSection from './sections/CpuGpuSection';
import AutoDiff from './sections/AutoDiff';
import ComputationGraphSection from './sections/ComputationGraphSection';
import TensorGradientCalculateSection from './sections/TensorGradientCalculateSection';
import BackPropagationSection from './sections/BackPropagationSection';
import AccessingGradientSection from './sections/AccessingGradientSection';
import DisableGradientsSection from './sections/DisableGradientsSection';
import GradientAccumulationSection from './sections/GradientAccumulationSection';
import TorchNNModuleSection from './sections/TorchNNModuleSection';
import CustomArchitectureSection from './sections/CustomArchitectureSection';
import ActivationFunctionSection from './sections/ActivationFunctionSection';
import SequentialContainerSection from './sections/SequentialContainerSection';
import LossFunctionSection from './sections/LossFunctionSection';
import OptimizerSection from './sections/OptimizerSection';
import DataLoaderSection from './sections/DataLoaderSection';
import DatasetSection from './sections/DatasetSection';
import TransformationSection from './sections/TransformationSection';
import DataloaderDetailSection from './sections/DataloaderDetailSection';
import DataloaderCustomizeSection from './sections/DataloaderCustomizeSection';
import TrainingLoopSection from './sections/TrainingLoopSection';
import IteratingDataLoaderSection from './sections/IteratingDataLoaderSection';
import ForwardPassAndLossSection from './sections/ForwardPassAndLossSection';
import BackwardOptimizerSection from './sections/BackwardOptimizerSection';
import EvaluationLoopSection from './sections/EvaluationLoopSection';
import SaveLoadSection from './sections/SaveLoadSection';
import CompleteTrainingSection from './sections/CompleteTrainingSection';
import CommonErrorSection from './sections/CommonErrorSection';
import InspectGradientSection from './sections/InspectGradientSection';


export default function App() {
  const [activeTab, setActiveTab] = useState('intro');

  const tabs = [
    { id: 'intro', label: 'Introduction', icon: Box },
    { id: 'dimensions', label: 'Dimensionality Flow', icon: Layers },
    { id: 'dl', label: 'Deep Learning Context', icon: Network },
    { id: 'why', label: 'Why PyTorch?', icon: Zap },
    { id: 'creation', label: 'Creating Tensors', icon: PlusSquare },
    { id: 'operations', label: 'Basic Operations', icon: Calculator },
    { id: 'numpy', label: 'NumPy Interop', icon: ArrowLeftRight },
    { id: 'indexing', label: 'Indexing & Slicing', icon: Scissors },
    { id: 'reshape', label: 'Reshaping & Rearranging', icon: ArrowRight },
    { id: 'join-split', label: 'Joining & Splitting', icon: ArrowRight },
    { id: 'broadcast', label: 'Broadcasting', icon: LineChart },
    { id: 'datatype', label: 'Data Types', icon: CheckCircle2 },
    { id: 'cpu-gpu', label: 'CPU vs GPU', icon: Cpu },
    { id: 'autodiff', label: 'Automatic Differentiation', icon: Activity },
    { id: 'computation-graph', label: 'Computation Graph', icon: GitBranch },
    { id: 'tensor-gradient', label: 'Tensor Gradient Calculation', icon: Code },
    { id: 'backpropagation', label: 'Backpropagation', icon: Play },
    { id: 'access', label: 'Accessing Gradients', icon: Terminal },
    { id: 'disable-gradients', label: 'Disabling Gradients', icon: AlertTriangle },
    { id: 'gradient-accumulation', label: 'Gradient Accumulation', icon: LineChart },
    { id: 'torch-nn', label: 'Torch NN Module', icon: Layers },
    { id: 'custom-architecture', label: 'Custom Architectures', icon: Network },
    { id: 'activation-functions', label: 'Activation Functions', icon: Database },
    { id: 'sequential-container', label: 'Sequential Container', icon: Database },
    { id: 'loss-function', label: 'Loss Functions', icon: Database },
    { id: 'optimizer', label: 'Optimizers', icon: Database },
    { id: 'data-loader', label: 'DataLoader and Dataset', icon: Database },
    { id: 'dataset', label: 'Dataset', icon: Database },
    { id: 'transformation', label: 'Transformation', icon: Database },
    { id: 'dataloader-detail', label: 'Dataloader Detail', icon: Database },
    { id: 'dataloader-customize', label: 'Dataloader Customize', icon: Database },
    { id: 'training-loop', label: 'Training Loop', icon: Database },
    { id: 'iterating-loader', label: 'Iterating Loader', icon: Database },
    { id: 'forward-pass-loss', label: 'Forward Pass & Loss', icon: Database },
    { id: 'backward-optimizer', label: 'Backward & Optimizer', icon: Database },
    { id: 'evaluation-loop', label: 'Evaluation Loop', icon: Database },
    { id: 'save-load', label: 'Saving & Loading Models', icon: Database },
    { id: 'complete-training', label: 'Complete Training Example', icon: Database },
    { id: 'common-errors', label: 'Common Errors', icon: Database },
    { id: 'inspect-gradient', label: 'Inspecting Gradients', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-6 font-sans">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-8 text-center md:text-left md:ml-64">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Introduction to Pytorch</h1>
          <p className="text-lg text-slate-600">All Topics</p>
        </header>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 flex-shrink-0 overflow-y-auto max-h-[calc(100vh-150px)] pr-2 pb-8 custom-scrollbar">
            <div className="flex flex-col gap-1.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-blue-100' : 'text-slate-400'} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 min-h-[500px]">
            {activeTab === 'intro' && <IntroSection />}
            {activeTab === 'dimensions' && <DimensionsSection />}
            {activeTab === 'dl' && <DeepLearningSection />}
            {activeTab === 'why' && <WhyPyTorchSection />}
            {activeTab === 'creation' && <CreationSection />}
            {activeTab === 'operations' && <OperationsSection />}
            {activeTab === 'numpy' && <NumpySection />}
            {activeTab === 'indexing' && <IndexingSection />}
            {activeTab === 'reshape' && <ReshapeSection />}
            {activeTab === 'join-split' && <JoinSplitSection />}
            {activeTab === 'broadcast' && <BroadcastSection />}
            {activeTab === 'datatype' && <DataTypeSection />}
            {activeTab === 'cpu-gpu' && <CpuGpuSection />}
            {activeTab === 'autodiff' && <AutoDiff />}
            {activeTab === 'computation-graph' && <ComputationGraphSection />}
            {activeTab === 'tensor-gradient' && <TensorGradientCalculateSection />}
            {activeTab === 'backpropagation' && <BackPropagationSection />}
            {activeTab === 'access' && <AccessingGradientSection />}
            {activeTab === 'disable-gradients' && <DisableGradientsSection />}
            {activeTab === 'gradient-accumulation' && <GradientAccumulationSection />}
            {activeTab === 'torch-nn' && <TorchNNModuleSection />}
            {activeTab === 'custom-architecture' && <CustomArchitectureSection />}
            {activeTab === 'activation-functions' && <ActivationFunctionSection />}
            {activeTab === 'sequential-container' && <SequentialContainerSection />}
            {activeTab === 'loss-function' && <LossFunctionSection />}
            {activeTab === 'optimizer' && <OptimizerSection />}
            {activeTab === 'data-loader' && <DataLoaderSection />}
            {activeTab === 'dataset' && <DatasetSection />}
            {activeTab === 'transformation' && <TransformationSection />}
            {activeTab === 'dataloader-detail' && <DataloaderDetailSection />}
            {activeTab === 'dataloader-customize' && <DataloaderCustomizeSection />}
            {activeTab === 'training-loop' && <TrainingLoopSection />}
            {activeTab === 'iterating-loader' && <IteratingDataLoaderSection />}
            {activeTab === 'forward-pass-loss' && <ForwardPassAndLossSection />}
            {activeTab === 'backward-optimizer' && <BackwardOptimizerSection />}
            {activeTab === 'evaluation-loop' && <EvaluationLoopSection />}
            {activeTab === 'save-load' && <SaveLoadSection />}
            {activeTab === 'complete-training' && <CompleteTrainingSection />}
            {activeTab === 'common-errors' && <CommonErrorSection />}
            {activeTab === 'inspect-gradient' && <InspectGradientSection />}
          </main>
        </div>
      </div>
    </div>
  );
}