import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Layers, ArrowUp, ArrowDown,
  BrainCircuit, Image as ImageIcon, Box, Shuffle,
  Activity, Target, AlertTriangle, Star, Sliders, Mic2, FileImage, 
  Workflow, GitBranch, Minimize2, Cpu, BarChart, HelpCircle, Lightbulb
} from 'lucide-react';

// --- SLIDE 1: Why Hierarchical VAEs? ---
const IntroHVAESlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center">Beyond Flat Latent Spaces: The HVAE</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Standard VAEs force all complexity into a single, flat layer of variables (z). For highly complex data like high-res images, this "flat" approach struggles to capture multi-scale organization.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* Flat VAE Metaphor */}
        <div className="flex-1 bg-slate-800 rounded-2xl shadow-xl border-t-4 border-rose-500 p-8 flex flex-col items-center text-center relative overflow-hidden">
           <h3 className="font-bold text-rose-400 mb-2 flex items-center gap-2 text-lg">
             Standard "Flat" VAE
           </h3>
           <p className="text-xs text-slate-500 mb-8 uppercase tracking-widest font-bold">The Overwhelmed Artist</p>
           
           <div className="flex-grow flex flex-col items-center justify-center w-full gap-4">
              <div className="bg-rose-900/30 border-2 border-rose-500/50 w-full rounded-xl p-4 flex items-center justify-center gap-2 shadow-inner">
                <span className="font-mono text-xs text-rose-300">z = [Global Layout, Lighting, Objects, Fine Textures, Colors...]</span>
              </div>
              <ArrowDown className="text-slate-500 w-6 h-6" />
              <div className="w-32 h-32 bg-slate-700 border-2 border-slate-500 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden">
                <img src="https://picsum.photos/id/1018/200/200" className="w-full h-full object-cover blur-[2px] opacity-70" alt="blurry landscape" />
              </div>
           </div>
           <p className="text-xs text-slate-400 mt-6 leading-relaxed">
             A single layer tries to control everything simultaneously. This creates an impossible bottleneck, leading to blurry, incoherent details in complex images.
           </p>
        </div>

        {/* Hierarchical VAE Metaphor */}
        <div className="flex-1 bg-slate-800 rounded-2xl shadow-xl border-t-4 border-emerald-500 p-8 flex flex-col items-center text-center relative overflow-hidden">
           <div className="absolute top-4 right-4 bg-emerald-900/50 text-emerald-400 border border-emerald-500/50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
             Multi-Scale
           </div>
           <h3 className="font-bold text-emerald-400 mb-2 flex items-center gap-2 text-lg">
             Hierarchical VAE (HVAE)
           </h3>
           <p className="text-xs text-slate-500 mb-8 uppercase tracking-widest font-bold">The Master Painter</p>
           
           <div className="flex-grow flex flex-col items-center justify-center w-full gap-3 relative">
              <div className="bg-purple-900/30 border-2 border-purple-500/50 w-3/4 rounded-xl p-2 shadow-inner z-30">
                <span className="font-mono text-[10px] text-purple-300 font-bold block mb-1">Top Layer (z_L)</span>
                <span className="text-xs text-purple-200">Global Scene Layout</span>
              </div>
              <ArrowDown className="text-slate-500 w-4 h-4 -my-1 z-20" />
              <div className="bg-blue-900/30 border-2 border-blue-500/50 w-5/6 rounded-xl p-2 shadow-inner z-20">
                <span className="font-mono text-[10px] text-blue-300 font-bold block mb-1">Middle Layers</span>
                <span className="text-xs text-blue-200">Major Objects & Lighting</span>
              </div>
              <ArrowDown className="text-slate-500 w-4 h-4 -my-1 z-10" />
              <div className="bg-emerald-900/30 border-2 border-emerald-500/50 w-full rounded-xl p-2 shadow-inner z-10">
                <span className="font-mono text-[10px] text-emerald-300 font-bold block mb-1">Bottom Layer (z_1)</span>
                <span className="text-xs text-emerald-200">Fine Textures & Details</span>
              </div>
              <ArrowDown className="text-slate-500 w-4 h-4" />
              <div className="w-32 h-32 bg-slate-700 border-2 border-slate-400 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.3)] relative overflow-hidden">
                <img src="https://picsum.photos/id/1018/200/200" className="w-full h-full object-cover" alt="sharp landscape" />
              </div>
           </div>
           <p className="text-xs text-slate-400 mt-6 leading-relaxed">
             The network separates concerns. Top layers dictate the broad strokes, while lower layers condition themselves on the top layers to paint in the fine details.
           </p>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 2: Interactive 2-Layer Architecture Diagram ---
const ArchitectureFlowSlide = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Start", desc: "Let's trace data through a 2-Layer HVAE.", focus: 'none' },
    { title: "Inference: Bottom-Up (Encoder 1)", desc: "The image x is processed by Encoder 1 to output the parameters (μ1, σ1) for the first latent layer z1.", focus: 'enc1' },
    { title: "Inference: Sample z1", desc: "We sample z1 from the distribution q(z1|x).", focus: 'z1_inf' },
    { title: "Inference: Bottom-Up (Encoder 2)", desc: "z1 (and optionally x) is processed by Encoder 2 to output parameters for the top layer z2.", focus: 'enc2' },
    { title: "Inference: Sample z2", desc: "We sample z2 from q(z2|z1, x). Inference is complete!", focus: 'z2_inf' },
    { title: "Generation: Top-Down (Prior)", desc: "To generate, we start at the top. We sample z2 from a generic Prior N(0,I).", focus: 'prior' },
    { title: "Generation: Decoder 1", desc: "The top-level concept z2 is passed to Decoder 1, which outputs the parameters (μ1', σ1') defining what z1 should look like.", focus: 'dec1' },
    { title: "Generation: Sample z1", desc: "We sample z1 from this new distribution p(z1|z2).", focus: 'z1_gen' },
    { title: "Generation: Decoder 2 (Final)", desc: "Finally, z1 is passed to Decoder 2 to generate the final reconstructed image x'.", focus: 'dec2' },
  ];

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-4">
        <h2 className="text-3xl font-bold mb-2 text-center">Tracing the 2-Layer HVAE Architecture</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Inference flows <strong>Bottom-Up</strong>. Generation flows <strong>Top-Down</strong>.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-4">
        
        {/* The Flowchart */}
        <div className="flex-[1.5] bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex items-center justify-center relative overflow-hidden">
           <div className="flex gap-12 w-full max-w-2xl relative h-[500px]">
              
              {/* LEFT: INFERENCE PATH */}
              <div className="flex-1 bg-slate-100/50 border-2 border-slate-200 rounded-xl p-4 flex flex-col items-center relative">
                 <span className="absolute -top-3 bg-white px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inference Path q(z|x)</span>
                 
                 <div className={`w-20 h-12 bg-blue-100 border-2 border-blue-400 rounded flex flex-col items-center justify-center z-10 transition-all duration-300 mt-2 ${step===1 ? 'shadow-[0_0_15px_rgba(96,165,250,0.6)] scale-110' : ''}`}>
                   <span className="text-xs font-bold text-blue-800">x (Data)</span>
                 </div>
                 <ArrowDown className="text-slate-400 w-4 h-4 my-2 z-0" />
                 
                 <div className={`w-36 h-10 bg-indigo-100 border-2 border-indigo-400 rounded-full flex flex-col items-center justify-center z-10 transition-all duration-300 ${step===1 ? 'shadow-[0_0_15px_rgba(99,102,241,0.6)] bg-indigo-200 scale-105' : ''}`}>
                   <span className="text-[10px] font-bold text-indigo-800">Encoder_1 Net</span>
                 </div>

                 <div className="flex items-center my-2 h-8 relative w-full justify-center z-0">
                    <div className="w-px h-full bg-slate-400"></div>
                    <span className="absolute left-[55%] text-[9px] font-mono text-slate-500">μ_1(x), σ_1(x)</span>
                 </div>

                 <div className={`w-36 h-10 bg-blue-500/20 border-2 border-blue-500 rounded-full flex flex-col items-center justify-center z-10 transition-all duration-300 ${step===2 ? 'shadow-[0_0_15px_rgba(59,130,246,0.6)] bg-blue-200 scale-105' : ''}`}>
                   <span className="text-[10px] font-bold text-blue-900">z_1 ~ q(z_1|x)</span>
                 </div>
                 <ArrowDown className="text-slate-400 w-4 h-4 my-2 z-0" />

                 <div className={`w-36 h-10 bg-indigo-100 border-2 border-indigo-400 rounded-full flex flex-col items-center justify-center z-10 transition-all duration-300 ${step===3 ? 'shadow-[0_0_15px_rgba(99,102,241,0.6)] bg-indigo-200 scale-105' : ''}`}>
                   <span className="text-[10px] font-bold text-indigo-800">Encoder_2 Net</span>
                 </div>

                 <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <path d="M 120 40 Q 180 150 120 280" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                    <text x="145" y="170" fontSize="8" fill="#94a3b8">optionally</text>
                 </svg>

                 <div className="flex items-center my-2 h-8 relative w-full justify-center z-0">
                    <div className="w-px h-full bg-slate-400"></div>
                    <span className="absolute left-[55%] text-[9px] font-mono text-slate-500">μ_2(z1), σ_2(z1)</span>
                 </div>

                 <div className={`w-36 h-10 bg-blue-500/20 border-2 border-blue-500 rounded-full flex flex-col items-center justify-center z-10 transition-all duration-300 ${step===4 || step===5 ? 'shadow-[0_0_15px_rgba(59,130,246,0.6)] bg-blue-200 scale-105' : ''}`}>
                   <span className="text-[10px] font-bold text-blue-900">z_2 ~ q(z_2|z_1,x)</span>
                 </div>
              </div>

              {/* RIGHT: GENERATIVE PATH */}
              <div className="flex-1 bg-rose-50/50 border-2 border-rose-100 rounded-xl p-4 flex flex-col items-center relative">
                 <span className="absolute -top-3 bg-white px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Generative Path p(x, z)</span>
                 
                 <div className={`w-36 h-10 bg-rose-200 border-2 border-rose-400 rounded-full flex flex-col items-center justify-center z-10 transition-all duration-300 mt-2 ${step===5 ? 'shadow-[0_0_15px_rgba(244,63,94,0.6)] scale-105' : ''}`}>
                   <span className="text-[10px] font-bold text-rose-900">Prior p(z_2) e.g. N(0,I)</span>
                 </div>
                 
                 <div className="flex items-center my-3 h-8 relative w-full justify-center z-0">
                    <div className="w-px h-full bg-slate-400"></div>
                    <span className="absolute left-[55%] text-[9px] text-slate-500">sample</span>
                 </div>

                 <div className={`w-36 h-10 bg-rose-500/40 border-2 border-rose-500 rounded-full flex flex-col items-center justify-center z-10 transition-all duration-300 ${step===5||step===6 ? 'shadow-[0_0_15px_rgba(244,63,94,0.6)] bg-rose-300 scale-105' : ''}`}>
                   <span className="text-[10px] font-bold text-rose-900">z_2 (Sampled)</span>
                 </div>
                 <ArrowDown className="text-slate-400 w-4 h-4 my-3 z-0" />

                 <div className={`w-36 h-10 bg-orange-100 border-2 border-orange-400 rounded-full flex flex-col items-center justify-center z-10 transition-all duration-300 ${step===6 ? 'shadow-[0_0_15px_rgba(249,115,22,0.6)] bg-orange-200 scale-105' : ''}`}>
                   <span className="text-[10px] font-bold text-orange-900">Decoder_1 Net</span>
                 </div>

                 <div className="flex items-center my-3 h-8 relative w-full justify-center z-0">
                    <div className="w-px h-full bg-slate-400"></div>
                    <span className="absolute left-[55%] text-[9px] font-mono text-slate-500">μ'_1(z2), σ'_1(z2)</span>
                 </div>

                 <div className={`w-36 h-10 bg-rose-500/40 border-2 border-rose-500 rounded-full flex flex-col items-center justify-center z-10 transition-all duration-300 ${step===7||step===8 ? 'shadow-[0_0_15px_rgba(244,63,94,0.6)] bg-rose-300 scale-105' : ''}`}>
                   <span className="text-[10px] font-bold text-rose-900">z_1 ~ p(z_1|z_2)</span>
                 </div>
                 <ArrowDown className="text-slate-400 w-4 h-4 my-3 z-0" />

                 <div className={`w-36 h-10 bg-orange-100 border-2 border-orange-400 rounded-full flex flex-col items-center justify-center z-10 transition-all duration-300 ${step===8 ? 'shadow-[0_0_15px_rgba(249,115,22,0.6)] bg-orange-200 scale-105' : ''}`}>
                   <span className="text-[10px] font-bold text-orange-900">Decoder_2 Net</span>
                 </div>

                 <div className="flex items-center my-3 h-8 relative w-full justify-center z-0">
                    <div className="w-px h-full bg-slate-400"></div>
                    <span className="absolute left-[55%] text-[9px] font-mono text-slate-500">μ'_x(z1), σ'_x(z1)</span>
                 </div>

                 <div className={`w-24 h-12 bg-rose-100 border-2 border-rose-400 rounded flex flex-col items-center justify-center z-10 transition-all duration-300 ${step===8 ? 'shadow-[0_0_15px_rgba(244,63,94,0.6)] scale-110' : ''}`}>
                   <span className="text-[10px] font-bold text-rose-800">x' (Generated)</span>
                 </div>
              </div>
           </div>
        </div>

        {/* RIGHT: Step Descriptions */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-8 border border-slate-700 min-h-[250px] flex flex-col">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest border-b border-slate-700 pb-2 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4"/> Step {step} of 8
              </h3>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={step}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col h-full"
                >
                  <h4 className="text-2xl font-bold text-slate-100 mb-4">{steps[step].title}</h4>
                  <p className="text-slate-300 leading-relaxed text-sm">{steps[step].desc}</p>
                </motion.div>
              </AnimatePresence>
           </div>

           <div className="flex justify-between items-center w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mt-auto">
             <button 
               onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
               className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center gap-1 text-sm"
             ><ChevronLeft className="w-4 h-4"/> Prev</button>
             
             <div className="flex gap-1">
               {steps.map((_, i) => (
                 <div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
               ))}
             </div>

             <button 
               onClick={() => setStep(Math.min(8, step + 1))} disabled={step === 8}
               className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg disabled:opacity-30 hover:bg-indigo-500 transition-colors flex items-center gap-1 text-sm"
             >Next <ChevronRight className="w-4 h-4"/></button>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 3: Deep Dive: How the Layers Actually Connect ---
const HVAEInferenceGenerationSlide = () => {
  const [step, setStep] = useState(0);

  const explanations = [
    {
      title: "Step 0: Bottom-Up Inference Starts",
      q1: "How do we sample layer by layer?",
      a1: "It starts just like a normal VAE! The first Encoder looks at the image x, outputs the Mean/Var parameters, and we randomly sample z1.",
      q2: "What is happening to z2 right now?",
      a2: "Nothing yet! In a bottom-up structure, we have to finish figuring out z1 before we can even begin calculating z2.",
      activeNode: "x_z1"
    },
    {
      title: "Step 1: Training Encoder 2",
      q1: "What do we train Encoder 2 on?",
      a1: "This is the big secret! Encoder 2 takes the sample z1 (and optionally x) as its INPUT. It treats the lower-level features as if they were raw data, extracting even deeper, more abstract patterns to output parameters for z2.",
      q2: "Why?",
      a2: "By chaining them, z2 becomes a 'summary of the summary'. z1 might hold 'eye positions', while z2 holds 'overall emotion'.",
      activeNode: "z1_z2"
    },
    {
      title: "Step 2: The Top of the Pyramid (z2)",
      q1: "What happens when we hit the top layer?",
      a1: "The top layer z2 is special. Its target during training is the standard Prior N(0,I). It anchors the entire hierarchy.",
      q2: "How does generation start?",
      a2: "To generate a new image from scratch, we start at the top. We pull a completely random coordinate for z2 from the Prior N(0,I).",
      activeNode: "z2_top"
    },
    {
      title: "Step 3: The Downward Journey (Decoder 1)",
      q1: "How do we revert back from z2 to z1?",
      a1: "We pass our z2 sample into Decoder 1. BUT, Decoder 1 DOES NOT output a specific z1 value!",
      q2: "Wait, then what does it output?",
      a2: "It outputs the Mean and Variance for a NEW bell curve (p(z1|z2)). It says: 'Based on the abstract emotion z2, here is the probability distribution for where the eyes (z1) should be.'",
      activeNode: "dec1"
    },
    {
      title: "Step 4: Sampling the 'Reverted' z1",
      q1: "So how do we actually get the z1 values?",
      a1: "We randomly sample z1 from the new bell curve that Decoder 1 just gave us! We use the Reparameterization Trick again.",
      q2: "Is this z1 the same as the one from the Encoder?",
      a2: "No! During generation, the Encoder is gone. This new z1 is purely hallucinated based on the rules dictated by Decoder 1 and z2.",
      activeNode: "z1_gen"
    },
    {
      title: "Step 5: Final Reconstruction (Decoder 2)",
      q1: "How do we get the final image?",
      a1: "We pass our newly sampled z1 into Decoder 2. Decoder 2 outputs the final pixel probabilities (x').",
      q2: "Does Decoder 2 care about z2?",
      a2: "Usually no! The hierarchy is a chain. z2 told Decoder 1 what to do. Decoder 1 told z1 what to be. And z1 tells Decoder 2 how to draw the final pixels.",
      activeNode: "dec2"
    }
  ];

  const currentInfo = explanations[step];

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center">Deep Dive: How the Layers Actually Connect</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Let's explicitly answer your questions: <em>"What do we train Encoder 2 on to get z2?"</em> and <em>"How do we revert back from z2 to z1?"</em>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* The Vertical Tree Visualizer */}
        <div className="flex-1 bg-slate-800 rounded-2xl shadow-xl border-4 border-slate-700 p-6 flex items-center justify-center relative overflow-hidden">
           
           <div className="flex justify-between w-full h-[400px] relative max-w-sm">
              
              {/* UPWARD PATH (Inference) */}
              <div className="w-1/2 h-full flex flex-col items-center justify-between relative border-r-2 border-dashed border-slate-600 pr-4">
                 <span className="absolute -top-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center w-full pr-4">Bottom-Up<br/>Inference</span>
                 
                 {/* Top (z2) */}
                 <motion.div animate={{ opacity: ['z2_top'].includes(currentInfo.activeNode) ? 1 : 0.3 }} className="flex flex-col items-center w-full">
                    <div className="bg-indigo-600/30 border-2 border-indigo-400 w-full py-2 rounded-xl text-center shadow-lg relative">
                      <span className="text-xs font-bold text-indigo-300">z2 (Top Latent)</span>
                      {currentInfo.activeNode === 'z1_z2' && (
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-indigo-100 text-indigo-900 font-mono text-[9px] font-bold px-2 py-1 rounded shadow-md w-max z-20">
                          Sampled from N(μ2, σ2)
                        </motion.div>
                      )}
                    </div>
                 </motion.div>

                 <motion.div animate={{ opacity: ['z1_z2'].includes(currentInfo.activeNode) ? 1 : 0.3 }} className="flex flex-col items-center w-full">
                    <ArrowUp className="w-5 h-5 text-indigo-400 my-1" />
                    <div className="bg-slate-700 border-2 border-indigo-400/50 w-3/4 py-1.5 rounded text-center shadow-inner relative">
                      <span className="text-[10px] font-bold text-slate-300">Encoder 2</span>
                      {currentInfo.activeNode === 'z1_z2' && (
                        <motion.div className="absolute inset-0 border-2 border-indigo-400 rounded animate-ping"></motion.div>
                      )}
                    </div>
                    <ArrowUp className="w-5 h-5 text-indigo-400 my-1" />
                 </motion.div>

                 {/* Middle (z1) */}
                 <motion.div animate={{ opacity: ['x_z1', 'z1_z2'].includes(currentInfo.activeNode) ? 1 : 0.3 }} className="flex flex-col items-center w-full">
                    <div className={`bg-blue-600/30 border-2 border-blue-400 w-full py-2 rounded-xl text-center shadow-lg relative transition-all ${currentInfo.activeNode === 'z1_z2' ? 'ring-4 ring-blue-500/50' : ''}`}>
                      <span className="text-xs font-bold text-blue-300">z1 (Mid Latent)</span>
                      {currentInfo.activeNode === 'x_z1' && (
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-900 font-mono text-[9px] font-bold px-2 py-1 rounded shadow-md w-max z-20">
                          Sampled from N(μ1, σ1)
                        </motion.div>
                      )}
                    </div>
                 </motion.div>

                 <motion.div animate={{ opacity: ['x_z1'].includes(currentInfo.activeNode) ? 1 : 0.3 }} className="flex flex-col items-center w-full">
                    <ArrowUp className="w-5 h-5 text-blue-400 my-1" />
                    <div className="bg-slate-700 border-2 border-blue-400/50 w-3/4 py-1.5 rounded text-center shadow-inner">
                      <span className="text-[10px] font-bold text-slate-300">Encoder 1</span>
                    </div>
                    <ArrowUp className="w-5 h-5 text-blue-400 my-1" />
                 </motion.div>

                 {/* Bottom (x) */}
                 <motion.div animate={{ opacity: ['x_z1'].includes(currentInfo.activeNode) ? 1 : 0.3 }} className="flex flex-col items-center w-full">
                    <div className="bg-emerald-600/30 border-2 border-emerald-400 w-full py-2 rounded-xl text-center shadow-lg">
                      <span className="text-xs font-bold text-emerald-300">x (Data)</span>
                    </div>
                 </motion.div>
              </div>

              {/* DOWNWARD PATH (Generation) */}
              <div className="w-1/2 h-full flex flex-col items-center justify-between relative pl-4">
                 <span className="absolute -top-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center w-full pl-4">Top-Down<br/>Generation</span>
                 
                 {/* Top (z2) */}
                 <motion.div animate={{ opacity: ['z2_top', 'dec1'].includes(currentInfo.activeNode) ? 1 : 0.3 }} className="flex flex-col items-center w-full">
                    <div className={`bg-rose-600/30 border-2 border-rose-400 w-full py-2 rounded-xl text-center shadow-lg relative transition-all ${currentInfo.activeNode === 'dec1' ? 'ring-4 ring-rose-500/50' : ''}`}>
                      <span className="text-xs font-bold text-rose-300">z2 ~ N(0, I)</span>
                    </div>
                 </motion.div>

                 <motion.div animate={{ opacity: ['dec1'].includes(currentInfo.activeNode) ? 1 : 0.3 }} className="flex flex-col items-center w-full">
                    <ArrowDown className="w-5 h-5 text-rose-400 my-1" />
                    <div className="bg-slate-700 border-2 border-rose-400/50 w-3/4 py-1.5 rounded text-center shadow-inner relative">
                      <span className="text-[10px] font-bold text-slate-300">Decoder 1</span>
                      {currentInfo.activeNode === 'dec1' && (
                        <motion.div className="absolute inset-0 border-2 border-rose-400 rounded animate-ping"></motion.div>
                      )}
                    </div>
                    <ArrowDown className="w-5 h-5 text-rose-400 my-1" />
                 </motion.div>

                 {/* Middle (z1) */}
                 <motion.div animate={{ opacity: ['dec1', 'z1_gen', 'dec2'].includes(currentInfo.activeNode) ? 1 : 0.3 }} className="flex flex-col items-center w-full">
                    <div className={`bg-orange-600/30 border-2 border-orange-400 w-full py-2 rounded-xl text-center shadow-lg relative transition-all ${currentInfo.activeNode === 'dec2' ? 'ring-4 ring-orange-500/50' : ''}`}>
                      <span className="text-xs font-bold text-orange-300">z1 (Sampled)</span>
                      {currentInfo.activeNode === 'dec1' && (
                        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-rose-100 text-rose-900 font-mono text-[9px] font-bold px-2 py-1 rounded shadow-md w-max z-20">
                          Outputs μ1', σ1'
                        </motion.div>
                      )}
                      {currentInfo.activeNode === 'z1_gen' && (
                        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-orange-100 text-orange-900 font-mono text-[9px] font-bold px-2 py-1 rounded shadow-md w-max z-20">
                          Sampled from N(μ1', σ1')
                        </motion.div>
                      )}
                    </div>
                 </motion.div>

                 <motion.div animate={{ opacity: ['dec2'].includes(currentInfo.activeNode) ? 1 : 0.3 }} className="flex flex-col items-center w-full">
                    <ArrowDown className="w-5 h-5 text-orange-400 my-1" />
                    <div className="bg-slate-700 border-2 border-orange-400/50 w-3/4 py-1.5 rounded text-center shadow-inner relative">
                      <span className="text-[10px] font-bold text-slate-300">Decoder 2</span>
                      {currentInfo.activeNode === 'dec2' && (
                        <motion.div className="absolute inset-0 border-2 border-orange-400 rounded animate-ping"></motion.div>
                      )}
                    </div>
                    <ArrowDown className="w-5 h-5 text-orange-400 my-1" />
                 </motion.div>

                 {/* Bottom (x') */}
                 <motion.div animate={{ opacity: ['dec2'].includes(currentInfo.activeNode) ? 1 : 0.3 }} className="flex flex-col items-center w-full">
                    <div className="bg-yellow-600/30 border-2 border-yellow-400 w-full py-2 rounded-xl text-center shadow-lg relative">
                      <span className="text-xs font-bold text-yellow-300">x' (Reconstructed)</span>
                      {currentInfo.activeNode === 'dec2' && (
                        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-900 font-mono text-[9px] font-bold px-2 py-1 rounded shadow-md w-max z-20">
                          Final Pixel Likelihood
                        </motion.div>
                      )}
                    </div>
                 </motion.div>

              </div>
           </div>

        </div>

        {/* The Q&A Content Panel */}
        <div className="flex-1 flex flex-col gap-4">
           
           <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex-grow flex flex-col">
              <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                 <h3 className="font-bold text-lg text-white flex items-center gap-2">
                   <Lightbulb className="w-5 h-5 text-amber-400"/> Step {step} of 5
                 </h3>
                 <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{currentInfo.title}</span>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={step}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-xl">
                    <div className="flex items-start gap-3 mb-2">
                      <HelpCircle className="w-5 h-5 text-blue-400 shrink-0" />
                      <span className="font-bold text-sm text-blue-300">{currentInfo.q1}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed ml-8">{currentInfo.a1}</p>
                  </div>

                  <div className="bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded-r-xl">
                    <div className="flex items-start gap-3 mb-2">
                      <HelpCircle className="w-5 h-5 text-purple-400 shrink-0" />
                      <span className="font-bold text-sm text-purple-300">{currentInfo.q2}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed ml-8">{currentInfo.a2}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
           </div>

           {/* Manual Controls */}
           <div className="flex justify-between items-center w-full bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-700 shrink-0">
             <button 
               onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
               className="px-6 py-2.5 bg-slate-700 text-white font-bold rounded-lg disabled:opacity-30 hover:bg-slate-600 transition-colors flex items-center gap-2 text-sm"
             ><ChevronLeft className="w-4 h-4"/> Previous</button>
             
             <div className="flex gap-1.5">
               {explanations.map((_, i) => (
                 <div key={i} className={`w-2.5 h-2.5 rounded-full ${i === step ? 'bg-indigo-500' : 'bg-slate-600'}`}></div>
               ))}
             </div>

             <button 
               onClick={() => setStep(Math.min(5, step + 1))} disabled={step === 5}
               className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg disabled:opacity-30 hover:bg-indigo-500 transition-colors flex items-center gap-2 text-sm"
             >Next Step <ChevronRight className="w-4 h-4"/></button>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 4: Deconstructing the HVAE Objective Function ---
const MathDeconstructionSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center">Deconstructing the HVAE Objective</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          The ELBO for an HVAE looks terrifying because of the sums, but it is conceptually identical to a standard VAE: <strong>One Reconstruction term, plus a KL penalty for EVERY layer.</strong>
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* The Massive Equation Box */}
        <div className="bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-700 p-8 flex flex-col items-center relative w-full shrink-0 overflow-hidden">
           <div className="font-mono text-[14px] md:text-xl font-bold text-white text-center flex flex-wrap justify-center items-center gap-y-6 gap-x-2 mt-2 w-full">
             <span className="text-slate-400">L<sub className="text-xs">HVAE</sub> =</span>
             
             {/* Recon Term */}
             <div className="relative group mx-2">
               <span className="bg-blue-900/50 text-blue-300 border border-blue-500/50 px-3 py-2 rounded-lg inline-block whitespace-nowrap shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                 E<sub className="text-[10px]">q(z|x)</sub> [ log p(x|z<sub className="text-[10px]">1</sub>) ]
               </span>
               <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-[10px] text-blue-400 uppercase tracking-widest font-sans font-bold whitespace-nowrap">
                 Reconstruction (z1 to x)
               </div>
             </div>
             
             <span className="text-slate-500 text-3xl mx-2">-</span>
             
             {/* KL Term 1 */}
             <div className="relative group mx-2">
               <span className="bg-emerald-900/50 text-emerald-300 border border-emerald-500/50 px-3 py-2 rounded-lg inline-block whitespace-nowrap shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                 E [ KL( q(z<sub className="text-[10px]">2</sub>|z<sub className="text-[10px]">1</sub>,x) || p(z<sub className="text-[10px]">2</sub>) ) ]
               </span>
               <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-[10px] text-emerald-400 uppercase tracking-widest font-sans font-bold whitespace-nowrap">
                 KL Penalty (Top Layer z2)
               </div>
             </div>

             <span className="text-slate-500 text-3xl mx-2">-</span>

             {/* KL Term 2 */}
             <div className="relative group mx-2">
               <span className="bg-rose-900/50 text-rose-300 border border-rose-500/50 px-3 py-2 rounded-lg inline-block whitespace-nowrap shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                 E [ KL( q(z<sub className="text-[10px]">1</sub>|x) || p(z<sub className="text-[10px]">1</sub>|z<sub className="text-[10px]">2</sub>) ) ]
               </span>
               <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-[10px] text-rose-400 uppercase tracking-widest font-sans font-bold whitespace-nowrap">
                 KL Penalty (Bottom Layer z1)
               </div>
             </div>

           </div>
        </div>

        {/* Translation Panels */}
        <div className="flex flex-col lg:flex-row gap-6 w-full flex-grow mt-4">
           
           <div className="flex-1 bg-slate-800/50 rounded-2xl border border-slate-700 p-6 flex flex-col relative overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-500"></div>
             <h4 className="font-bold text-emerald-400 text-lg mb-2 pl-4 flex items-center gap-2"><Target className="w-5 h-5"/> Top Layer KL (z2)</h4>
             <p className="text-sm text-slate-300 leading-relaxed pl-4">
               The top-most layer (<span className="font-mono text-xs">z2</span>) is compared directly to the standard prior <span className="font-mono text-xs bg-slate-900 px-1 rounded text-purple-300">p(z2) = N(0, I)</span>. This acts as the global anchor for the entire hierarchical manifold.
             </p>
           </div>

           <div className="flex-1 bg-slate-800/50 rounded-2xl border border-slate-700 p-6 flex flex-col relative overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 w-2 bg-rose-500"></div>
             <h4 className="font-bold text-rose-400 text-lg mb-2 pl-4 flex items-center gap-2"><Layers className="w-5 h-5"/> Lower Layer KLs (z1)</h4>
             <p className="text-sm text-slate-300 leading-relaxed pl-4">
               Notice that <span className="font-mono text-xs">z1</span> is NOT compared to N(0,I). It is compared to <span className="font-mono text-xs bg-slate-900 px-1 rounded text-orange-300">p(z1|z2)</span>. The target for <span className="font-mono text-xs">z1</span> is dynamically generated by the top layer <span className="font-mono text-xs">z2</span>! This forces the layers to cooperate.
             </p>
           </div>

        </div>

      </div>
    </div>
  );
};

// --- SLIDE 5: Advantages & Design Choices ---
const AdvantagesDesignSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center">Advantages & Design Choices</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          Why build deep hierarchies? And how do we structure the flow of information?
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* LEFT: Advantages Panel */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex flex-col relative overflow-hidden">
           <h3 className="font-bold text-emerald-600 mb-6 text-sm uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
             <Star className="w-5 h-5"/> Key Benefits
           </h3>
           
           <div className="flex flex-col gap-4 flex-grow justify-center">
             <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-emerald-500 shadow-sm">
               <h4 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
                 <Box className="w-4 h-4 text-emerald-600"/> Modeling Complex Distributions
               </h4>
               <p className="text-xs text-slate-600 leading-relaxed">
                 Deeper hierarchies capture intricate dependencies better than a shallow, single-layer latent space. Essential for high-dimensional data like HD images or video.
               </p>
             </div>

             <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-emerald-500 shadow-sm">
               <h4 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
                 <ImageIcon className="w-4 h-4 text-emerald-600"/> Improved Sample Quality
               </h4>
               <p className="text-xs text-slate-600 leading-relaxed">
                 The layered structure allows the model to progressively refine details. Deep models like NVAE generate significantly sharper, more coherent samples than standard VAEs.
               </p>
             </div>

             <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-emerald-500 shadow-sm">
               <h4 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
                 <Layers className="w-4 h-4 text-emerald-600"/> Multi-Scale Representation
               </h4>
               <p className="text-xs text-slate-600 leading-relaxed">
                 Layers specialize. <span className="font-mono text-emerald-700 bg-emerald-100 px-1 rounded">z_L</span> (top) encodes global scene layout, while <span className="font-mono text-emerald-700 bg-emerald-100 px-1 rounded">z_1</span> (bottom) encodes fine textures. Leads to interpretable representations.
               </p>
             </div>
           </div>
        </div>

        {/* RIGHT: Design Variations */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex flex-col relative overflow-hidden">
           <h3 className="font-bold text-blue-600 mb-6 text-sm uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
             <Sliders className="w-5 h-5"/> Architectural Choices
           </h3>
           
           <div className="flex flex-col gap-4 flex-grow justify-center">
             
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
               <Workflow className="w-8 h-8 text-blue-500 shrink-0 mt-1"/>
               <div>
                 <h4 className="font-bold text-slate-800 text-sm mb-1">Direction of Information Flow</h4>
                 <ul className="text-xs text-slate-600 leading-relaxed space-y-2">
                   <li><strong className="text-blue-700">Standard:</strong> Bottom-up inference (Encoder), Top-down generation (Decoder).</li>
                   <li><strong className="text-blue-700">Top-Down Inference:</strong> Infer higher-level latents first <span className="font-mono text-[10px] bg-slate-200 px-1 rounded">q(z_L|x)</span>, then refine downwards <span className="font-mono text-[10px] bg-slate-200 px-1 rounded">q(z_L-1|z_L,x)</span>.</li>
                 </ul>
               </div>
             </div>

             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
               <GitBranch className="w-8 h-8 text-blue-500 shrink-0 mt-1"/>
               <div>
                 <h4 className="font-bold text-slate-800 text-sm mb-1">Skip Connections</h4>
                 <p className="text-xs text-slate-600 leading-relaxed">
                   Crucial for gradient flow. Connections can jump between layers in the encoder, the decoder, or laterally from the encoder directly to the decoder (U-Net style). Prevents "vanishing information".
                 </p>
               </div>
             </div>

             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
               <Shuffle className="w-8 h-8 text-blue-500 shrink-0 mt-1"/>
               <div>
                 <h4 className="font-bold text-slate-800 text-sm mb-1">Stochastic vs Deterministic</h4>
                 <p className="text-xs text-slate-600 leading-relaxed">
                   While every layer <span className="font-mono text-blue-700 bg-blue-100 px-1 rounded">z_i</span> is a stochastic variable, the neural network layers connecting them are completely deterministic (they just calculate parameters μ, σ).
                 </p>
               </div>
             </div>

           </div>
        </div>

      </div>
    </div>
  );
};

// --- SLIDE 6: Training Challenges (Vanishing Gradients & Posterior Collapse) ---
const TrainingChallengesSlide = () => {
  const [networkDepth, setNetworkDepth] = useState(3);
  
  // Logic: deeper network = higher chance of gradients vanishing and top layers collapsing
  const topLayerStatus = networkDepth > 5 ? 'collapsed' : 'active';
  const gradientStrength = Math.max(0, 100 - (networkDepth * 15));

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-900 text-white">
      <div className="flex flex-col items-center shrink-0 mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">HVAE Training Challenges</h2>
        <p className="text-slate-400 text-center max-w-4xl text-sm md:text-base">
          Adding layers increases capacity, but it also creates severe optimization hurdles.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full flex-grow items-stretch pb-8">
        
        {/* LEFT: Deep Network Simulator */}
        <div className="flex-[1.2] bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 flex flex-col relative overflow-hidden items-center">
           <h3 className="font-bold text-slate-300 mb-4 text-sm uppercase tracking-widest border-b border-slate-700 pb-2 w-full text-center">
             The Depth Problem
           </h3>
           
           <div className="flex-grow flex items-center justify-center w-full gap-4 relative">
              {/* The Latent Stack */}
              <div className="flex flex-col gap-2 w-32 relative z-10">
                 {Array.from({length: networkDepth}).map((_, i) => {
                   const isTop = i === 0;
                   const isBottom = i === networkDepth - 1;
                   const isCollapsed = isTop && topLayerStatus === 'collapsed';
                   
                   return (
                     <div key={i} className="flex flex-col items-center">
                        {i > 0 && <ArrowUp className={`w-4 h-4 mb-1 ${gradientStrength < 30 && i < networkDepth/2 ? 'text-rose-500/50' : 'text-emerald-400'}`} />}
                        <div className={`w-full py-2 rounded text-center text-xs font-bold font-mono transition-colors shadow-md ${isCollapsed ? 'bg-rose-900/80 border-2 border-rose-500 text-rose-300' : 'bg-indigo-600 border-2 border-indigo-400 text-white'}`}>
                          {isTop ? 'Top z_L' : isBottom ? 'Bottom z_1' : `z_${networkDepth - i}`}
                        </div>
                     </div>
                   );
                 })}
              </div>

              {/* Gradient Flow Visualizer */}
              <div className="w-16 h-full flex flex-col items-center justify-end relative">
                 <span className="absolute -top-6 text-[10px] text-slate-500 uppercase font-bold whitespace-nowrap">Gradient Signal</span>
                 <div className="w-4 bg-slate-700 rounded-full h-full relative overflow-hidden flex items-end">
                    <motion.div 
                      className="w-full bg-emerald-500" 
                      animate={{ height: `${gradientStrength}%`, backgroundColor: gradientStrength > 40 ? '#10b981' : '#f43f5e' }}
                      transition={{ type: "spring", stiffness: 100 }}
                    />
                 </div>
              </div>
           </div>

           <div className="w-full max-w-sm mt-6">
             <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
               <span>Shallow (2 Layers)</span>
               <span className="text-white">Depth: {networkDepth} Layers</span>
               <span>Deep (8 Layers)</span>
             </div>
             <input type="range" min="2" max="8" value={networkDepth} onChange={(e) => setNetworkDepth(parseInt(e.target.value))} className="w-full accent-indigo-500" />
           </div>
        </div>

        {/* RIGHT: Challenges Explanation */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
           
           <div className={`bg-slate-800 p-5 rounded-xl border-l-4 transition-colors ${gradientStrength < 40 ? 'border-rose-500 bg-rose-950/20' : 'border-slate-600'}`}>
             <h4 className="font-bold text-rose-400 text-lg mb-1 flex items-center gap-2"><BarChart className="w-5 h-5"/> Vanishing Gradients</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               As the hierarchy gets deeper, the reconstruction error signal (from the bottom) struggles to propagate up through many stochastic layers. The top layers receive almost zero gradient, making them impossible to train.
             </p>
           </div>

           <div className={`bg-slate-800 p-5 rounded-xl border-l-4 transition-colors ${topLayerStatus === 'collapsed' ? 'border-amber-500 bg-amber-950/20' : 'border-slate-600'}`}>
             <h4 className="font-bold text-amber-400 text-lg mb-1 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Posterior Collapse in High Layers</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               If gradients vanish, the top layers (<span className="font-mono text-xs">z_L</span>) stop receiving useful information from the data. To minimize the KL divergence penalty effortlessly, they "collapse" into the generic prior <span className="font-mono text-xs">p(z_L)</span> and become completely "inactive" and uninformative.
             </p>
           </div>

           <div className="bg-slate-800 p-5 rounded-xl border-l-4 border-blue-500">
             <h4 className="font-bold text-blue-400 text-lg mb-1 flex items-center gap-2"><Cpu className="w-5 h-5"/> Computational Cost</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               More layers mean drastically more parameters. Furthermore, sampling sequentially through a deep hierarchy during generation is slow. Techniques like <strong>KL Annealing</strong> (turning on KL loss slowly) and <strong>Skip Connections</strong> (giving gradients a fast-track highway) are mandatory to train these beasts.
             </p>
           </div>

        </div>

      </div>
    </div>
  );
};

// --- SLIDE 7: Prominent Architectures ---
const ProminentExamplesSlide = () => {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center shrink-0 mb-8">
        <h2 className="text-3xl font-bold mb-2 text-center text-slate-800">Prominent Examples & Applications</h2>
        <p className="text-slate-600 text-center max-w-4xl text-sm md:text-base">
          HVAEs have pushed the boundaries of generative modeling, providing a richer framework for understanding variation than standard VAEs.
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full flex-grow items-stretch pb-8 justify-center">
        
        {/* LVAE */}
        <div className="bg-white rounded-2xl shadow-md border-l-8 border-indigo-500 p-6 flex items-start gap-6 hover:-translate-y-1 transition-transform cursor-default">
           <div className="bg-indigo-100 p-4 rounded-full shrink-0">
             <Layers className="w-8 h-8 text-indigo-600" />
           </div>
           <div>
             <h3 className="text-xl font-bold text-slate-800 mb-2">Ladder Variational Autoencoders (LVAEs)</h3>
             <p className="text-sm text-slate-600 leading-relaxed">
               One of the earliest influential HVAE architectures. It demonstrated improved performance through a hierarchical latent structure and introduced the concept of <strong>layer-wise refinement</strong>, sharing information laterally between inference and generative paths to stabilize training.
             </p>
           </div>
        </div>

        {/* NVAE / VDVAE */}
        <div className="bg-white rounded-2xl shadow-md border-l-8 border-rose-500 p-6 flex items-start gap-6 hover:-translate-y-1 transition-transform cursor-default">
           <div className="bg-rose-100 p-4 rounded-full shrink-0">
             <FileImage className="w-8 h-8 text-rose-600" />
           </div>
           <div>
             <h3 className="text-xl font-bold text-slate-800 mb-2">NVAE (Nouveau VAE) & VDVAE (Very Deep VAE)</h3>
             <p className="text-sm text-slate-600 leading-relaxed">
               The state-of-the-art in VAE image generation. These models employ <strong>very deep hierarchies</strong> (often dozens of layers) equipped with residual connections and careful architectural balancing. They produce extremely high-resolution images with fidelity and diversity that rival GANs.
             </p>
           </div>
        </div>

        {/* Audio / Speech */}
        <div className="bg-white rounded-2xl shadow-md border-l-8 border-emerald-500 p-6 flex items-start gap-6 hover:-translate-y-1 transition-transform cursor-default">
           <div className="bg-emerald-100 p-4 rounded-full shrink-0">
             <Mic2 className="w-8 h-8 text-emerald-600" />
           </div>
           <div>
             <h3 className="text-xl font-bold text-slate-800 mb-2">Speech Synthesis & Music Generation</h3>
             <p className="text-sm text-slate-600 leading-relaxed">
               Audio is inherently hierarchical (intent → rhythm/prosody → words → raw acoustic waveforms). HVAEs are uniquely suited for this. Higher latent layers can model global prosody or tempo, while the lower layers synthesize the raw, high-frequency audio features.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
};


// --- MAIN SLIDESHOW COMPONENT ---
const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    IntroHVAESlide,
    ArchitectureFlowSlide,
    HVAEInferenceGenerationSlide, // NEW DEEP DIVE SLIDE ADDED HERE
    MathDeconstructionSlide,
    AdvantagesDesignSlide,
    TrainingChallengesSlide,
    ProminentExamplesSlide
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div className="flex flex-col h-screen bg-slate-200 font-sans">
      {/* Top Progress Bar */}
      <div className="w-full h-1.5 bg-slate-300">
        <motion.div
          className="h-full bg-indigo-600"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-hidden relative">
        <AnimatePresence mode='wait'>
          <motion.div
            key={`slide-${currentSlide}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full absolute inset-0"
          >
            <CurrentSlideComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center p-4 md:p-6 bg-white border-t border-slate-300 z-10">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:bg-slate-200"
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-6 h-6"/>
        </button>
        
        <div className="flex space-x-2">
          {slides.map((_, i) => (
            <div
              key={`dot-${i}`}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentSlide ? 'bg-indigo-600 scale-125' : 'bg-slate-300'}`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-indigo-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:bg-indigo-700 shadow-md"
          disabled={currentSlide === slides.length - 1}
        >
          <ChevronRight className="w-6 h-6"/>
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="App">
      <Slideshow />
    </div>
  );
}