import React from 'react';

export default function IntroSection() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">What is a Tensor?</h2>
      <div className="prose prose-blue max-w-none text-slate-600 text-lg leading-relaxed">
        <p className="mb-4">
          The <strong>Tensor</strong> is the core data structure for working with PyTorch. If you have experience with NumPy, you will find PyTorch Tensors quite familiar. Tensors are multi-dimensional arrays, very similar to NumPy's <code>ndarray</code>.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg my-6">
          <p className="m-0 text-blue-900">
            <strong>Key Concept:</strong> Think of tensors as generalizations of familiar mathematical objects. They allow us to structure data in increasingly complex, multi-dimensional grids.
          </p>
        </div>
        <p>
          Click on the <strong>Dimensionality Flow</strong> tab above to interactively explore how tensors scale from simple scalars to complex higher-dimensional structures.
        </p>
      </div>
    </div>
  );
}