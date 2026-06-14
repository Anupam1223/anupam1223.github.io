import React, { useState, useEffect, useRef } from 'react';
import { Activity, Grid, Layers, HardDrive, ChevronRight } from 'lucide-react';

// Utility functions for math and colors
const lerp = (start, end, t) => start + (end - start) * t;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
};

// A simple colormap function (Dark Blue -> Purple -> Orange -> Yellow)
const getSpectrogramColor = (intensity) => {
  const i = clamp(intensity, 0, 1);
  if (i < 0.33) {
    return [
      lerp(10, 80, i / 0.33),
      lerp(10, 0, i / 0.33),
      lerp(40, 120, i / 0.33)
    ]; // Blue to Purple
  } else if (i < 0.66) {
    const t = (i - 0.33) / 0.33;
    return [
      lerp(80, 220, t),
      lerp(0, 80, t),
      lerp(120, 20, t)
    ]; // Purple to Orange
  } else {
    const t = (i - 0.66) / 0.34;
    return [
      lerp(220, 255, t),
      lerp(80, 250, t),
      lerp(20, 100, t)
    ]; // Orange to Yellow
  }
};

export default function App() {
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const progressRef = useRef(progress); // Ref for the animation loop to access current state

  // Update ref when state changes so animation loop has latest value
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // Stage definitions based on progress (0-100)
  const getStageInfo = (p) => {
    if (p < 25) return { 
      title: '1. Raw Waveform (1D)', 
      icon: <Activity className="w-6 h-6 text-cyan-400" />,
      desc: 'At 22,050 Hz, 3 seconds of audio is 66,150 raw amplitude numbers. It has no structural patterns that a neural network can easily digest. We need to expose the "frequencies" hiding inside this wave.',
      color: 'border-cyan-500'
    };
    if (p < 50) return { 
      title: '2. STFT Spectrogram (2D)', 
      icon: <Grid className="w-6 h-6 text-purple-400" />,
      desc: 'We transform the 1D wave into a 2D "Image" (Time vs. Frequency). BUT humans hear logarithmically. We easily hear the difference between 100Hz and 200Hz, but can\'t tell 10,000Hz from 10,100Hz. A linear scale gives equal vertical space to both, wasting huge amounts of data on high pitches we don\'t care about.',
      color: 'border-purple-500'
    };
    if (p < 75) return { 
      title: '3. Mel-Spectrogram (2D)', 
      icon: <Layers className="w-6 h-6 text-orange-400" />,
      desc: 'We warp the Y-axis using the "Mel Scale". This compresses the useless high frequencies into a tiny space and expands the crucial low frequencies. It mimics human hearing perfectly, giving us an optimized, dense 2D image of the sound.',
      color: 'border-orange-500'
    };
    return { 
      title: '4. VAE Encoder \u2192 Latent Vector (1D)', 
      icon: <HardDrive className="w-6 h-6 text-yellow-400" />,
      desc: 'How does the Normalizing Flow get its data? A VAE Encoder (Convolutional Neural Network) looks at the 2D Mel-Spectrogram image and compresses it down into a tiny 1D Latent Vector (z). This 1D array of features is what the Normalizing Flow actually learns to model!',
      color: 'border-yellow-500'
    };
  };

  // Canvas Animation & Rendering Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let timeOffset = 0;

    // Generate static mock spectrogram data once
    const TIME_BINS = 100;
    const FREQ_BINS = 50;
    const spectroData = [];
    
    for (let t = 0; t < TIME_BINS; t++) {
      const col = [];
      for (let f = 0; f < FREQ_BINS; f++) {
        // Create some fake "formants" (bands of energy) mimicking speech/audio
        const f1 = Math.exp(-Math.pow(f - 10, 2) / 20) * (0.5 + 0.5 * Math.sin(t * 0.1));
        const f2 = Math.exp(-Math.pow(f - (25 + Math.sin(t * 0.05) * 5), 2) / 30) * 0.8;
        const noise = Math.random() * 0.15;
        col.push(clamp(f1 + f2 + noise, 0, 1));
      }
      spectroData.push(col);
    }

    const draw = () => {
      // Handle canvas resizing for sharp rendering (Fixed re-render bug)
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      
      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.scale(dpr, dpr);
      }

      ctx.clearRect(0, 0, width, height);
      
      const p = progressRef.current;
      timeOffset += 0.05; // Advance time for waveform animation

      // --- Morphing Parameters based on Progress (0 to 100) ---
      
      // Phase 1: Waveform (0 - 30) fading out
      const waveOpacity = clamp(mapRange(p, 20, 30, 1, 0), 0, 1);
      
      // Phase 2: Spectrogram fading in (15 - 35)
      const spectroOpacity = clamp(mapRange(p, 15, 35, 0, 1), 0, 1);
      
      // Phase 3: Mel Warp (45 - 65)
      const melWarpAmount = clamp(mapRange(p, 45, 65, 0, 1), 0, 1);
      
      // Phase 4: Latent Squash (70 - 95)
      const latentSquashAmount = clamp(mapRange(p, 75, 95, 0, 1), 0, 1);

      // Calculate the target center Y for the latent squash (Moved to wider scope to fix crash)
      const centerY = height / 2;
      const targetLatentHeight = height * 0.15; // The thin 1D vector height
      const targetLatentTop = centerY - targetLatentHeight / 2;

      // --- Draw Spectrogram / Latent Vector ---
      if (spectroOpacity > 0) {
        ctx.globalAlpha = spectroOpacity;
        
        const cellWidth = width / TIME_BINS;

        for (let t = 0; t < TIME_BINS; t++) {
          // Average energy for this column (used for the latent representation)
          const colEnergy = spectroData[t].reduce((a, b) => a + b, 0) / FREQ_BINS;
          
          for (let f = 0; f < FREQ_BINS; f++) {
            const intensity = spectroData[t][f];
            
            // 1. Linear Y calculation
            const cellHeightLinear = height / FREQ_BINS;
            const yLinear = height - (f + 1) * cellHeightLinear;
            
            // 2. Mel Y calculation (logarithmic curve pushing higher frequencies up/compressing them)
            // Simplified approximation for visualization
            const normalizedF = f / FREQ_BINS;
            const melCurve = Math.pow(normalizedF, 1.5); 
            const yMel = height - (melCurve * height);
            
            // Interpolate between Linear and Mel based on slider
            let yActual = lerp(yLinear, yMel, melWarpAmount);
            let hActual = lerp(cellHeightLinear, cellHeightLinear * (1 - melWarpAmount * 0.5), melWarpAmount); // Approximate height warp
            
            // 3. Latent Squash Calculation
            // Squeeze the Y position towards the center strip
            yActual = lerp(yActual, targetLatentTop, latentSquashAmount);
            hActual = lerp(hActual, targetLatentHeight, latentSquashAmount);

            // In Latent phase, color morphs to represent average feature intensity rather than specific frequencies
            const finalIntensity = lerp(intensity, colEnergy * 1.5, latentSquashAmount);
            
            const [r, g, b] = getSpectrogramColor(finalIntensity);
            
            // Slight border during Latent phase to look like discrete tensor blocks
            if (latentSquashAmount > 0.8 && (f % 5 !== 0)) continue; // Simplify the blocks for latent visual

            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            
            if (latentSquashAmount > 0.8) {
                // Draw as vertical blocks in Latent phase
                ctx.fillRect(t * cellWidth, yActual, cellWidth + 0.5, hActual);
            } else {
                // Draw standard heatmap cell
                // We add 0.5 to width/height to prevent sub-pixel rendering gaps
                ctx.fillRect(t * cellWidth, yActual, cellWidth + 0.5, hActual + 1);
            }
          }
        }
        ctx.globalAlpha = 1.0;
      }

      // --- Draw 1D Waveform ---
      if (waveOpacity > 0) {
        ctx.globalAlpha = waveOpacity;
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#22d3ee'; // Cyan-400
        
        const numPoints = 800; // Dense high sample rate look
        
        for (let i = 0; i < numPoints; i++) {
          const x = (i / numPoints) * width;
          // Generate complex wave pattern
          const t = i * 0.1 + timeOffset;
          let yOffset = Math.sin(t) * 20 + 
                        Math.sin(t * 3.4) * 10 + 
                        Math.cos(t * 8.1) * 5 + 
                        (Math.random() - 0.5) * 15; // High freq noise
                        
          // Envelope to make it look like bursts of sound
          const envelope = Math.sin(i * 0.01 + timeOffset * 0.2) > 0 ? 1 : 0.2;
          
          ctx.lineTo(x, (height / 2) + yOffset * envelope);
        }
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }
      
      // Draw axis labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '12px sans-serif';
      if (p > 10 && p < 80) {
        ctx.fillText("Time \u2192", width - 50, height - 10);
        ctx.save();
        ctx.translate(15, height / 2 + 20);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(melWarpAmount > 0.5 ? "Frequency (Mel Scale) \u2192" : "Frequency (Linear) \u2192", 0, 0);
        ctx.restore();
      } else if (p >= 80) {
        ctx.fillText("VAE Latent Dimension (z)", width / 2 - 70, height / 2 + targetLatentHeight/2 + 20);
      } else {
        ctx.fillText("Time \u2192", width - 50, height / 2 + 60);
        ctx.save();
        ctx.translate(15, height / 2 + 20);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText("Amplitude →", 0, 0);
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const stage = getStageInfo(progress);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans p-4 md:p-8">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto w-full mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-orange-400 text-transparent bg-clip-text">
          Audio to Latent Pipeline
        </h1>
        <p className="text-gray-400 mt-2">
          Drag the slider to visualize how sound data is transformed for your Normalizing Flow model.
        </p>
      </div>

      {/* Main Visualization Canvas */}
      <div className="max-w-5xl mx-auto w-full flex-grow flex flex-col relative mb-8">
        <div className="w-full h-64 md:h-96 bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden relative">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full block"
          />
          
          {/* Overlay Stage Badge */}
          <div className="absolute top-4 left-4 bg-gray-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-700/50 flex items-center gap-2">
            {stage.icon}
            <span className="font-semibold text-sm tracking-wide">{stage.title}</span>
          </div>
        </div>
      </div>

      {/* Interactive Slider Area */}
      <div className="max-w-4xl mx-auto w-full space-y-8">
        
        {/* Slider */}
        <div className="relative pt-6 pb-2">
          {/* Custom Track Background Marks */}
          <div className="absolute w-full flex justify-between px-2 top-0 text-xs text-gray-500 font-medium">
            <span>Raw</span>
            <span>STFT</span>
            <span>Mel</span>
            <span>Latent</span>
          </div>
          
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            style={{
              background: `linear-gradient(to right, 
                #22d3ee ${clamp(progress, 0, 25)}%, 
                #c084fc ${clamp(progress, 25, 50)}%, 
                #fb923c ${clamp(progress, 50, 75)}%, 
                #facc15 ${clamp(progress, 75, 100)}%, 
                #1f2937 ${progress}%)`
            }}
          />
        </div>

        {/* Dynamic Explanation Panel */}
        <div className={`p-6 rounded-2xl border-l-4 bg-gray-900/50 transition-colors duration-500 ${stage.color}`}>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-800 rounded-xl">
              {stage.icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{stage.title}</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {stage.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Step Buttons (Optional quick jump) */}
        <div className="flex justify-between items-center gap-2 pt-4">
          <button onClick={() => setProgress(0)} className="px-4 py-2 text-sm bg-gray-900 hover:bg-gray-800 rounded-lg text-cyan-400 transition-colors border border-gray-800">1. Waveform</button>
          <ChevronRight className="w-4 h-4 text-gray-700 hidden sm:block" />
          <button onClick={() => setProgress(37)} className="px-4 py-2 text-sm bg-gray-900 hover:bg-gray-800 rounded-lg text-purple-400 transition-colors border border-gray-800">2. STFT</button>
          <ChevronRight className="w-4 h-4 text-gray-700 hidden sm:block" />
          <button onClick={() => setProgress(62)} className="px-4 py-2 text-sm bg-gray-900 hover:bg-gray-800 rounded-lg text-orange-400 transition-colors border border-gray-800">3. Mel Scale</button>
          <ChevronRight className="w-4 h-4 text-gray-700 hidden sm:block" />
          <button onClick={() => setProgress(100)} className="px-4 py-2 text-sm bg-gray-900 hover:bg-gray-800 rounded-lg text-yellow-400 transition-colors border border-gray-800">4. VAE \u2192 Latent</button>
        </div>

      </div>
    </div>
  );
}