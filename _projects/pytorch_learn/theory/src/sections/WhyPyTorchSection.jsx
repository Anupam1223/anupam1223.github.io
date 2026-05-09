import React from 'react';
import { Cpu, Zap } from 'lucide-react';

export default function WhyPyTorchSection() {
  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-2">Why PyTorch Tensors?</h2>
      <p className="text-slate-600 mb-8 text-lg">
        What makes PyTorch Tensors particularly suited for deep learning, compared to standard Python lists or even NumPy arrays?
      </p>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-indigo-200 transform -rotate-3">
            <Cpu size={32} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-indigo-900 mb-2">1. GPU Acceleration</h3>
            <p className="text-indigo-800/80 leading-relaxed mb-4">
              Tensors can be easily moved to and processed on Graphics Processing Units (GPUs) or other hardware accelerators. This provides massive speedups for the computationally intensive operations common in deep learning.
            </p>
            <div className="bg-indigo-100/50 p-4 rounded-lg text-sm text-indigo-900 space-y-2 border border-indigo-100">
              <p className="font-semibold mb-1">How PyTorch enables this under the hood:</p>
              <ul className="list-disc pl-5 space-y-2 text-indigo-800/90">
                <li><strong>C++/CUDA Backends:</strong> Core operations aren't executed in standard Python. PyTorch translates your Python commands into highly optimized C++ and CUDA (for NVIDIA) or MPS (for Apple) code.</li>
                <li><strong>Direct VRAM Allocation:</strong> When you call <code>tensor.to('cuda')</code>, PyTorch bypasses system RAM and allocates memory directly in the GPU's ultra-fast Video RAM.</li>
                <li><strong>Kernel Dispatching:</strong> When you perform a calculation (e.g., matrix multiplication), PyTorch's internal "dispatcher" detects the tensor's device. If it's on a GPU, it routes the operation to specialized hardware libraries like <strong>cuBLAS</strong> or <strong>cuDNN</strong> instead of the CPU processor.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-amber-200 transform rotate-3">
            <Zap size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">2. Automatic Differentiation</h3>
            <p className="text-amber-800/80 leading-relaxed">
              PyTorch Tensors have built-in support for automatic differentiation through the <strong>Autograd</strong> system. This mechanism automatically calculates gradients, which are fundamental for training neural networks via backpropagation.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-slate-100 rounded-lg text-slate-600 text-sm text-center">
        While the concept is similar to NumPy arrays, these two features are what make PyTorch Tensors the foundation for building and training models efficiently.
      </div>
    </div>
  );
}