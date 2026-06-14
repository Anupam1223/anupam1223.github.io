import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Layers } from 'lucide-react';
import PipelineOverviewSection from './sections/PipelineOverviewSection';
import ConvolutionVae from './sections/ConvolutionVae';
import ConvolutionVaeWorking from './sections/ConvolutionVaeWorking';
import ConvVAEArchitecture from './sections/ConvVAEArchitecture';
import NormalizingFlowVisualizer from './sections/NormalizingFlowVisualizer';

const PAGES = [
  {
    id: 'pipeline',
    label: 'Audio to Latent Pipeline',
    tag: 'Overview',
    tagColor: 'text-cyan-400 bg-cyan-400/10',
    component: PipelineOverviewSection,
  },
  {
    id: 'vae',
    label: 'VAE Bottleneck',
    tag: 'Architecture',
    tagColor: 'text-green-400 bg-green-400/10',
    component: ConvolutionVae,
  },
  {
    id: 'vae-working',
    label: 'How the VAE Works',
    tag: 'Deep Dive',
    tagColor: 'text-purple-400 bg-purple-400/10',
    component: ConvolutionVaeWorking,
  },
  {
    id: 'vae-architecture',
    label: 'VAE Architecture',
    tag: 'components.py',
    tagColor: 'text-violet-400 bg-violet-400/10',
    component: ConvVAEArchitecture,
  },
  {
    id: 'normalizing-flow',
    label: 'Normalizing Flow',
    tag: 'flow_model.py',
    tagColor: 'text-green-400 bg-green-400/10',
    component: NormalizingFlowVisualizer,
  },
];

export default function App() {
  const [activePage, setActivePage] = useState('pipeline');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = PAGES.find((p) => p.id === activePage);
  const PageComponent = current.component;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">

      {/* ── Sticky Top Nav ── */}
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">

          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-purple-500/20 rounded-lg">
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            <span className="font-bold text-sm text-gray-200 tracking-wide hidden sm:block">
              Sound Generation Docs
            </span>
          </div>

          {/* Page tabs (visible on md+) */}
          <div className="hidden md:flex items-center gap-1">
            {PAGES.map((page) => (
              <button
                key={page.id}
                onClick={() => setActivePage(page.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activePage === page.id
                    ? 'bg-gray-700 text-white shadow-inner'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>

          {/* Dropdown (visible on small screens) */}
          <div className="relative md:hidden" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 text-sm font-medium transition-colors"
            >
              <span className="max-w-[160px] truncate">{current.label}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                {PAGES.map((page, i) => (
                  <button
                    key={page.id}
                    onClick={() => { setActivePage(page.id); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between gap-3 ${
                      activePage === page.id
                        ? 'bg-purple-600/20 text-purple-300 font-semibold'
                        : 'text-gray-300 hover:bg-gray-700'
                    } ${i !== 0 ? 'border-t border-gray-700/60' : ''}`}
                  >
                    <span>{page.label}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${page.tagColor}`}>
                      {page.tag}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* ── Page Content ── */}
      <PageComponent />
    </div>
  );
}