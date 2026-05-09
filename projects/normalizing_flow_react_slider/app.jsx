import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Network, Cpu } from 'lucide-react';

// ── Section components ────────────────────────────────────────────────────────
import Section01, { meta as m01 } from './sections/Section01';
import Section02, { meta as m02 } from './sections/Section02';
import Section03, { meta as m03 } from './sections/Section03';
import Section04, { meta as m04 } from './sections/Section04';
import Section05, { meta as m05 } from './sections/Section05';
import Section06, { meta as m06 } from './sections/Section06';
import Section07, { meta as m07 } from './sections/Section07';
import Section08, { meta as m08 } from './sections/Section08';
import Section09, { meta as m09 } from './sections/Section09';
import Section10, { meta as m10 } from './sections/Section10';
import Section11, { meta as m11 } from './sections/Section11';
import Section12, { meta as m12 } from './sections/Section12';
import Section13, { meta as m13 } from './sections/Section13';
import Section14, { meta as m14 } from './sections/Section14';
import Section15, { meta as m15 } from './sections/Section15';
import Section16, { meta as m16 } from './sections/Section16';
import Section17, { meta as m17 } from './sections/Section17';
import Section18, { meta as m18 } from './sections/Section18';
import Section19, { meta as m19 } from './sections/Section19';
import Section20, { meta as m20 } from './sections/Section20';
import Section21, { meta as m21 } from './sections/Section21';
import Section22, { meta as m22 } from './sections/Section22';
import Section23, { meta as m23 } from './sections/Section23';
import Section24, { meta as m24 } from './sections/Section24';
import Section25, { meta as m25 } from './sections/Section25';
import Section26, { meta as m26 } from './sections/Section26';
import Section27, { meta as m27 } from './sections/Section27';
import Section28, { meta as m28 } from './sections/Section28';
import Section29, { meta as m29 } from './sections/Section29';
import Section30, { meta as m30 } from './sections/Section30';
import Section31, { meta as m31 } from './sections/Section31';
import Section32, { meta as m32 } from './sections/Section32';
import Section33, { meta as m33 } from './sections/Section33';
import Section34, { meta as m34 } from './sections/Section34';
import Section35, { meta as m35 } from './sections/Section35';
import Section36, { meta as m36 } from './sections/Section36';
import Section37, { meta as m37 } from './sections/Section37';
import Section38, { meta as m38 } from './sections/Section38';
import Section39, { meta as m39 } from './sections/Section39';

export default function App() {
  // ── Shared state ─────────────────────────────────────────────────────────────
  const [step, setStep] = useState(0);

  // Section 02
  const [squeezeLevel, setSqueezeLevel] = useState(50);

  // Section 04
  const [isFlowing, setIsFlowing] = useState(false);

  // Section 05
  const [flowDirection, setFlowDirection] = useState('training');

  // Section 07
  const [trainingEpoch, setTrainingEpoch] = useState(0);
  const runTrainingEpoch = () => {
    if (trainingEpoch >= 100) { setTrainingEpoch(0); return; }
    setTrainingEpoch(prev => Math.min(prev + 33.33, 100));
  };

  // Section 10
  const [stretchFactor, setStretchFactor] = useState(1);

  // Section 12
  const [scaleX, setScaleX] = useState(1.0);
  const [scaleY, setScaleY] = useState(1.0);
  const determinant = (scaleX * scaleY).toFixed(2);

  // Sections 14 & 15
  const [formulaView, setFormulaView] = useState('textbook');

  const renderFormulaToggle = () => (
    <div className="flex justify-center gap-2 mb-6 bg-gray-100 p-1 rounded-lg w-fit mx-auto">
      <button
        onClick={() => setFormulaView('textbook')}
        className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${formulaView === 'textbook' ? 'bg-white shadow text-rose-600' : 'text-gray-500 hover:text-gray-700'}`}
      >
        Textbook View (Generating: Z → X)
      </button>
      <button
        onClick={() => setFormulaView('pytorch')}
        className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${formulaView === 'pytorch' ? 'bg-white shadow text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
      >
        PyTorch View (Training: X → Z)
      </button>
    </div>
  );

  // ── Steps registry ────────────────────────────────────────────────────────────
  const steps = [
    { meta: m01, component: <Section01 /> },
    { meta: m02, component: <Section02 squeezeLevel={squeezeLevel} setSqueezeLevel={setSqueezeLevel} /> },
    { meta: m03, component: <Section03 /> },
    { meta: m04, component: <Section04 isFlowing={isFlowing} setIsFlowing={setIsFlowing} /> },
    { meta: m05, component: <Section05 flowDirection={flowDirection} setFlowDirection={setFlowDirection} /> },
    { meta: m06, component: <Section06 /> },
    { meta: m07, component: <Section07 trainingEpoch={trainingEpoch} runTrainingEpoch={runTrainingEpoch} /> },
    { meta: m08, component: <Section08 /> },
    { meta: m09, component: <Section09 /> },
    { meta: m10, component: <Section10 stretchFactor={stretchFactor} setStretchFactor={setStretchFactor} /> },
    { meta: m11, component: <Section11 /> },
    { meta: m12, component: <Section12 scaleX={scaleX} scaleY={scaleY} setScaleX={setScaleX} setScaleY={setScaleY} determinant={determinant} /> },
    { meta: m13, component: <Section13 /> },
    {
      meta: {
        title: formulaView === 'textbook' ? m14.title : m14.titlePyTorch,
        subtitle: formulaView === 'textbook' ? m14.subtitle : m14.subtitlePyTorch,
      },
      component: <Section14 formulaView={formulaView} renderFormulaToggle={renderFormulaToggle} />,
    },
    { meta: m15, component: <Section15 formulaView={formulaView} renderFormulaToggle={renderFormulaToggle} /> },
    { meta: m16, component: <Section16 /> },
    { meta: m17, component: <Section17 /> },
    { meta: m18, component: <Section18 /> },
    { meta: m19, component: <Section19 /> },
    { meta: m20, component: <Section20 /> },
    { meta: m21, component: <Section21 /> },
    { meta: m22, component: <Section22 /> },
    { meta: m23, component: <Section23 /> },
    { meta: m24, component: <Section24 /> },
    { meta: m25, component: <Section25 /> },
    { meta: m26, component: <Section26 /> },
    { meta: m27, component: <Section27 /> },
    { meta: m28, component: <Section28 /> },
    { meta: m29, component: <Section29 /> },
    { meta: m30, component: <Section30 /> },
    { meta: m31, component: <Section31 /> },
    { meta: m32, component: <Section32 /> },
    { meta: m33, component: <Section33 /> },
    { meta: m34, component: <Section34 /> },
    { meta: m35, component: <Section35 /> },
    { meta: m36, component: <Section36 /> },
    { meta: m37, component: <Section37 /> },
    { meta: m38, component: <Section38 /> },
    { meta: m39, component: <Section39 /> },
  ];

  const current = steps[step];

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans flex justify-center items-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5">

        {/* Header */}
        <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Network size={120} />
          </div>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <Cpu className="text-indigo-400" />
              Normalizing Flows: Architecture &amp; Implementation
            </h1>
            <p className="text-slate-300 text-sm">Visualizing stochastic optimal control, math intuition, and PyTorch concepts.</p>
          </div>

          {/* Progress bar — clickable dots */}
          <div className="flex gap-1 mt-6">
            {steps.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setStep(idx)}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 cursor-pointer ${idx <= step ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-slate-700 hover:bg-slate-500'}`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 min-h-[550px] flex flex-col">
          <div className="mb-6">
            <div className="inline-block bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-indigo-100 shadow-sm">
              Slide {step + 1} of {steps.length}
            </div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight leading-tight">{current.meta.title}</h2>
            <h3 className="text-md text-indigo-500 font-medium mt-2">{current.meta.subtitle}</h3>
          </div>

          <div className="flex-grow flex flex-col justify-center">
            {current.component}
          </div>
        </div>

        {/* Footer / Navigation */}
        <div className="bg-slate-50 border-t border-slate-200 p-5 flex justify-between items-center gap-4">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className={`flex items-center whitespace-nowrap gap-2 px-5 py-2.5 rounded-lg font-bold transition-all ${step === 0 ? 'text-slate-400 bg-slate-100 cursor-not-allowed' : 'text-slate-700 bg-white hover:bg-slate-200 hover:shadow shadow-sm border border-slate-200 active:scale-95'}`}
          >
            <ArrowLeft size={18} /> Previous
          </button>

          <div className="hidden md:block flex-1 max-w-md">
            <select
              value={step}
              onChange={(e) => setStep(Number(e.target.value))}
              className="w-full text-center px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer truncate"
            >
              {steps.map((sec, idx) => (
                <option key={idx} value={idx}>
                  Slide {idx + 1}: {sec.meta.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
            disabled={step === steps.length - 1}
            className={`flex items-center whitespace-nowrap gap-2 px-5 py-2.5 rounded-lg font-bold transition-all shadow-sm ${step === steps.length - 1 ? 'text-slate-400 bg-slate-100 cursor-not-allowed border border-slate-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md active:scale-95'}`}
          >
            Next <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
