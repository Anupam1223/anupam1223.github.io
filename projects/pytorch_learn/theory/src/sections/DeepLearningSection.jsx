import React from 'react';
import { Database, Network, Activity, GitBranch } from 'lucide-react';

export default function DeepLearningSection() {
  const items = [
    { icon: Database, title: "Input Data", desc: "A batch of images, sequences of text, or tables of features.", color: "text-emerald-600", bg: "bg-emerald-100" },
    { icon: Network, title: "Model Parameters", desc: "Weights and biases of neural network layers.", color: "text-blue-600", bg: "bg-blue-100" },
    { icon: Activity, title: "Intermediate Activations", desc: "The outputs of layers within the network.", color: "text-purple-600", bg: "bg-purple-100" },
    { icon: GitBranch, title: "Gradients", desc: "Values computed during backpropagation used to update model parameters.", color: "text-rose-600", bg: "bg-rose-100" },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-2">Tensors in Deep Learning</h2>
      <p className="text-slate-600 mb-8 text-lg">In the context of deep learning, tensors are used to represent virtually everything. They are the universal language of neural networks.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex gap-4 p-5 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${item.bg} ${item.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
