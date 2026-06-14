import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Play, Pause } from 'lucide-react';

export default function ConvolutionVaeWorking() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(c => c + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(c => c - 1);
  };

  const slides = [
    <Slide1_MelSpectrogram key="s1" />,
    <Slide2_AnimatedConvolution key="s2" />,
    <Slide3_EncoderFunnel key="s3" />,
    <Slide4_VAE_Bottleneck key="s4" />
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="max-w-5xl w-full flex flex-col space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Visualizing the Audio VAE
            </h1>
            <p className="text-slate-400 mt-2 text-sm">How Convolution compresses sound into the Latent Space</p>
          </div>
          <div className="flex space-x-2">
            {[0, 1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-8 bg-cyan-500' : 'w-2 bg-slate-800'}`}
              />
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
          <div className="flex-grow p-6 relative">
            {slides[currentSlide]}
          </div>

          {/* Navigation */}
          <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-between items-center">
            <button 
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="flex items-center space-x-2 px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" /> <span>Back</span>
            </button>
            <span className="text-slate-500 font-mono text-sm">Step {currentSlide + 1} of 4</span>
            <button 
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="flex items-center space-x-2 px-6 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span>Next</span> <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// SLIDE 1: The .pt File (Mel-Spectrogram)
// ==========================================
function Slide1_MelSpectrogram() {
  return (
    <div className="flex flex-col h-full animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-2">1. The Input: Your `.pt` File</h2>
      <p className="text-slate-400 mb-8 max-w-2xl">
        This is what the preprocessing script saved to your hard drive. It's a 2D tensor representing a 3-second audio clip.
        Height is pitch, width is time. Currently, it has <strong>20,640 numbers</strong> per audio clip.
      </p>

      <div className="flex-grow flex items-center justify-center">
        <div className="relative group">
          {/* Decorative dimensions */}
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-cyan-400 font-mono text-sm tracking-widest">
            H=80 (Mels)
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-cyan-400 font-mono text-sm tracking-widest">
            W=258 (Time Frames)
          </div>
          
          {/* The "Spectrogram" Image */}
          <div className="w-[600px] h-[200px] bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 rounded-lg border-2 border-cyan-500/50 p-2 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col justify-between overflow-hidden relative">
            {/* Fake Audio Waves inside the spectrogram */}
            <div className="absolute inset-0 opacity-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')]"></div>
            <div className="w-full h-8 bg-gradient-to-r from-transparent via-yellow-400/80 to-transparent blur-md transform -rotate-2 mt-10"></div>
            <div className="w-full h-4 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent blur-sm transform rotate-1 mb-8"></div>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 backdrop-blur-sm rounded">
              <span className="font-mono text-xl text-cyan-300 font-bold">Tensor Shape: [1, 80, 258]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SLIDE 2: Animated Convolution
// ==========================================
function Slide2_AnimatedConvolution() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [step, setStep] = useState(0);

  // Grid is 6x6. Kernel is 3x3. Stride is 2.
  // Valid top-left corners for the kernel: (0,0), (0,2), (0,4), (2,0), (2,2), (2,4), (4,0), (4,2), (4,4)
  const positions = [
    {r: 0, c: 0}, {r: 0, c: 2}, {r: 0, c: 4},
    {r: 2, c: 0}, {r: 2, c: 2}, {r: 2, c: 4},
    {r: 4, c: 0}, {r: 4, c: 2}, {r: 4, c: 4},
  ];

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setStep(s => (s + 1) % positions.length);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, positions.length]);

  const currentPos = positions[step];

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">2. The Magic of `stride=2`</h2>
          <p className="text-slate-400 max-w-xl">
            A Convolutional layer slides a 3x3 window over the image. Because we set <code>stride=2</code>, the window <strong>skips a pixel</strong> every time it moves. This mathematically cuts the output resolution perfectly in half!
          </p>
        </div>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400"
        >
          {isPlaying ? <Pause className="w-5 h-5"/> : <Play className="w-5 h-5"/>}
        </button>
      </div>

      <div className="flex-grow flex items-center justify-center space-x-16 mt-8">
        
        {/* Input Grid (6x6) */}
        <div className="flex flex-col items-center">
          <span className="text-sm font-mono text-cyan-400 mb-4">Input Tensor</span>
          <div className="relative bg-slate-800 border-2 border-slate-700 rounded-lg p-2 shadow-xl">
            <div className="grid grid-cols-6 grid-rows-6 gap-1 relative">
              {Array.from({length: 36}).map((_, i) => {
                const row = Math.floor(i / 6);
                const col = i % 6;
                // Highlight cells under the 3x3 kernel
                const inKernel = row >= currentPos.r && row < currentPos.r + 3 && 
                                 col >= currentPos.c && col < currentPos.c + 3;
                return (
                  <div key={i} className={`w-8 h-8 rounded-sm transition-colors duration-300 ${inKernel ? 'bg-cyan-500/80' : 'bg-slate-700'}`}>
                  </div>
                );
              })}
              
              {/* The Sliding Kernel Box */}
              <div 
                className="absolute border-4 border-cyan-300 rounded shadow-[0_0_15px_rgba(34,211,238,0.8)] z-10 transition-all duration-500 ease-in-out"
                style={{
                  top: `${currentPos.r * (32 + 4)}px`, // 32px height + 4px gap
                  left: `${currentPos.c * (32 + 4)}px`,
                  width: `${3 * 32 + 2 * 4}px`,
                  height: `${3 * 32 + 2 * 4}px`
                }}
              />
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center animate-pulse">
          <div className="h-1 w-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
          <span className="text-xs font-mono mt-2 text-slate-500">Extracts to 1 pixel</span>
        </div>

        {/* Output Grid (3x3) */}
        <div className="flex flex-col items-center">
          <span className="text-sm font-mono text-purple-400 mb-4">Output Tensor</span>
          <div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-2 shadow-xl">
            <div className="grid grid-cols-3 grid-rows-3 gap-2">
              {Array.from({length: 9}).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-10 h-10 rounded transition-all duration-300 ${i === step ? 'bg-purple-500 scale-110 shadow-[0_0_15px_rgba(168,85,247,0.8)]' : 'bg-slate-700'}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SLIDE 3: The Encoder Funnel
// ==========================================
function Slide3_EncoderFunnel() {
  return (
    <div className="flex flex-col h-full animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-2">3. The Dimension Funnel</h2>
      <p className="text-slate-400 mb-8">
        As the audio passes through all 4 Convolutional layers, the width and height shrink, but the <strong>Channels (Depth)</strong> expand. It goes from a wide, flat image to a long, dense stick of data.
      </p>

      <div className="flex-grow flex items-center justify-center space-x-4 px-10">
        
        <FunnelStage 
          name="Input" shape="[1, 80, 258]" 
          h={160} w={200} depth={10} color="from-slate-700 to-slate-600" 
        />
        <ChevronRight className="w-6 h-6 text-slate-600" />
        
        <FunnelStage 
          name="Conv1" shape="[32, 40, 129]" 
          h={120} w={150} depth={30} color="from-cyan-800 to-cyan-700" 
        />
        <ChevronRight className="w-6 h-6 text-slate-600" />
        
        <FunnelStage 
          name="Conv2" shape="[64, 20, 65]" 
          h={80} w={100} depth={60} color="from-blue-700 to-blue-600" 
        />
        <ChevronRight className="w-6 h-6 text-slate-600" />
        
        <FunnelStage 
          name="Conv3" shape="[128, 10, 33]" 
          h={50} w={60} depth={90} color="from-indigo-600 to-indigo-500" 
        />
        <ChevronRight className="w-6 h-6 text-slate-600" />
        
        <FunnelStage 
          name="Conv4" shape="[256, 5, 17]" 
          h={30} w={40} depth={130} color="from-purple-500 to-purple-400" glow
        />

      </div>
    </div>
  );
}

// Helper component to draw 3D-ish blocks
function FunnelStage({ name, shape, h, w, depth, color, glow }) {
  return (
    <div className="flex flex-col items-center justify-end h-full group">
      {/* 3D Block Representation */}
      <div className="relative flex items-center justify-center mb-6" style={{ width: depth, height: h }}>
        {/* Shadow/Depth layers to simulate channels */}
        <div className={`absolute rounded bg-gradient-to-br ${color} opacity-30`} style={{ width: w, height: h, transform: 'translateX(-8px) translateY(8px)' }}></div>
        <div className={`absolute rounded bg-gradient-to-br ${color} opacity-60`} style={{ width: w, height: h, transform: 'translateX(-4px) translateY(4px)' }}></div>
        
        {/* Front Face */}
        <div className={`absolute rounded bg-gradient-to-br ${color} flex items-center justify-center border border-white/10 ${glow ? 'shadow-[0_0_20px_rgba(168,85,247,0.6)]' : ''} transition-transform group-hover:scale-105`} style={{ width: w, height: h }}>
           <span className="text-[10px] font-bold text-white/50 transform -rotate-90 block">{shape.split(',')[0].replace('[','')} Ch</span>
        </div>
      </div>
      <div className="text-center font-mono mt-auto">
        <div className="text-white font-bold text-sm">{name}</div>
        <div className="text-cyan-300 text-xs mt-1">{shape}</div>
      </div>
    </div>
  );
}

// ==========================================
// SLIDE 4: The Bottleneck & VAE Split
// ==========================================
function Slide4_VAE_Bottleneck() {
  return (
    <div className="flex flex-col h-full animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-2">4. Flattening & The VAE Split</h2>
      <p className="text-slate-400 mb-8 max-w-2xl">
        The final Convolutional layer gives us <code>[256, 5, 17]</code>. We flatten this into a 1D line of 21,760 numbers. 
        Then, the magic of the VAE splits it into a Mean (μ) and Variance (σ), which we use to sample our final `[256]` Latent Vector!
      </p>

      <div className="flex-grow flex flex-col items-center justify-center space-y-6">
        
        {/* Step 1: The final block */}
        <div className="flex items-center space-x-4">
           <div className="w-16 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded flex items-center justify-center font-mono text-xs font-bold border border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
             [256, 5, 17]
           </div>
           <span className="text-slate-500">→</span>
           <div className="text-sm font-mono text-cyan-400 bg-slate-800 px-3 py-1 rounded">x.view(x.size(0), -1)</div>
        </div>

        {/* Step 2: Flattened */}
        <div className="flex items-center space-x-4">
           <div className="w-[400px] h-4 bg-slate-700 rounded-full overflow-hidden flex">
             {Array.from({length: 40}).map((_, i) => (
               <div key={i} className="flex-1 border-r border-slate-800 bg-gradient-to-b from-slate-500 to-slate-600"></div>
             ))}
           </div>
           <span className="font-mono text-xs text-slate-400">[21,760] numbers</span>
        </div>

        <div className="flex space-x-12 mt-4 text-slate-500 font-bold text-xl">
           ↓
        </div>

        {/* Step 3: VAE Split */}
        <div className="flex space-x-16 items-start">
           <div className="flex flex-col items-center">
              <span className="text-yellow-400 font-serif text-lg font-bold mb-2">μ (Mean)</span>
              <div className="w-[150px] h-4 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-400"></div>
              <span className="font-mono text-xs text-yellow-500 mt-2">[256]</span>
           </div>
           
           <div className="flex items-center justify-center h-full text-2xl font-bold text-slate-400">+</div>

           <div className="flex flex-col items-center">
              <span className="text-emerald-400 font-serif text-lg font-bold mb-2">σ (Variance)</span>
              <div className="w-[150px] h-4 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"></div>
              <span className="font-mono text-xs text-emerald-500 mt-2">[256]</span>
           </div>
        </div>

        <div className="flex space-x-12 mt-4 text-slate-500 font-bold text-xl animate-bounce">
           ↓
        </div>

        {/* Step 4: Final Latent Vector */}
        <div className="flex flex-col items-center bg-cyan-900/30 p-4 rounded-xl border border-cyan-800">
            <span className="text-cyan-300 font-bold mb-2 text-lg">Final Latent Vector (z)</span>
            <div className="w-[200px] h-6 rounded-full bg-gradient-to-r from-cyan-600 to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.6)]"></div>
            <span className="font-mono text-sm text-cyan-200 mt-2">shape: [256]</span>
            <p className="text-xs text-slate-400 mt-2 max-w-xs text-center">This tiny vector is what your Normalizing Flow will learn to manipulate!</p>
        </div>

      </div>
    </div>
  );
}