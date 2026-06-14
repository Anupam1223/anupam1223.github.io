import React, { useState, useEffect, useRef } from 'react';
import { Image, Minimize2, Database, Maximize2, RefreshCcw, ChevronRight } from 'lucide-react';

// Utility functions for math and colors
const lerp = (start, end, t) => start + (end - start) * t;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
};

// Spectrogram Colormap (Purple -> Orange -> Yellow)
const getSpectroColor = (intensity) => {
  const i = clamp(intensity, 0, 1);
  if (i < 0.5) {
    const t = i / 0.5;
    return [lerp(40, 220, t), lerp(10, 80, t), lerp(120, 20, t)];
  } else {
    const t = (i - 0.5) / 0.5;
    return [lerp(220, 255, t), lerp(80, 250, t), lerp(20, 100, t)];
  }
};

// Latent Space Colormap (Neon Cyan -> Green to represent abstract features)
const getLatentColor = (intensity) => {
  const i = clamp(intensity, 0, 1);
  return [lerp(10, 50, i), lerp(150, 255, i), lerp(120, 200, i)];
};

export default function VAEVisualizer() {
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // Stage definitions based on progress
  const getStageInfo = (p) => {
    if (p < 20) return { 
      title: '1. Input Mel-Spectrogram (80x256)', 
      icon: <Image className="w-6 h-6 text-purple-400" />,
      desc: 'Normalizing flows require input/output dimensions to match exactly, and a massive 2D matrix (80x256 = 20,480 points) per frame is way too large. We must compress it first.',
      color: 'border-purple-500'
    };
    if (p < 45) return { 
      title: '2. The Encoder (Convolutional CNN)', 
      icon: <Minimize2 className="w-6 h-6 text-cyan-400" />,
      desc: 'The Encoder part of the VAE takes your 80x256 image and passes it through Convolutional layers, squeezing out redundancies and extracting the core "features" of the sound.',
      color: 'border-cyan-500'
    };
    if (p < 65) return { 
      title: '3. The Latent Space (Size 256)', 
      icon: <Database className="w-6 h-6 text-green-400" />,
      desc: 'The Bottleneck! The 2D image has been completely crushed down into a dense 1D vector of 256 numbers. This tiny, rich array is what your Normalizing Flow will actually learn from.',
      color: 'border-green-500'
    };
    if (p < 85) return { 
      title: '4. The Decoder (Reconstruction)', 
      icon: <Maximize2 className="w-6 h-6 text-orange-400" />,
      desc: 'To ensure our Latent Space actually captured the audio correctly, the Decoder attempts to inflate the 256 numbers back into the original 80x256 image. Note: Normalizing Flows do not use this part.',
      color: 'border-orange-500'
    };
    return { 
      title: '5. Output (Train the VAE)', 
      icon: <RefreshCcw className="w-6 h-6 text-yellow-400" />,
      desc: 'The VAE outputs a reconstructed (slightly blurry) spectrogram. We measure the difference between Input and Output to train the VAE. Once trained, we detach the Encoder to feed the Normalizing Flow!',
      color: 'border-yellow-500'
    };
  };

  // Canvas Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Internal data resolution (scaled down slightly for smooth 60fps rendering)
    const COLS = 64; 
    const ROWS = 32;
    
    // 1. Generate Fake Spectrogram Data
    const spectroData = [];
    const latentData = [];
    
    for (let c = 0; c < COLS; c++) {
      const col = [];
      let latentSum = 0;
      for (let r = 0; r < ROWS; r++) {
        const val = Math.exp(-Math.pow(r - (15 + Math.sin(c * 0.2) * 5), 2) / 20) * 0.8 + Math.random() * 0.2;
        col.push(clamp(val, 0, 1));
        latentSum += val;
      }
      spectroData.push(col);
      // Generate a distinct "feature" value for the latent bottleneck
      latentData.push(clamp((latentSum / ROWS) * 2.5 + Math.sin(c * 0.5)*0.2, 0, 1));
    }

    const draw = () => {
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

      // Morphing calculations
      // Phase 1: Encode (10 -> 45)
      const t_encode = clamp(mapRange(p, 10, 45, 0, 1), 0, 1);
      // Phase 2: Decode (55 -> 90)
      const t_decode = clamp(mapRange(p, 55, 90, 0, 1), 0, 1);
      
      const isDecoding = p >= 50;
      
      // Target visual dimensions
      const maxW = width * 0.8;
      const maxH = height * 0.7;
      const minW = width * 0.4; // Latent vector is narrower
      const minH = height * 0.15; // Latent vector is a thin 1D strip
      
      let currentW, currentH, dataTransition;
      
      if (!isDecoding) {
        // Shrinking
        // Apply an easing curve so it swoops in
        const easeEncode = t_encode < 0.5 ? 2 * t_encode * t_encode : 1 - Math.pow(-2 * t_encode + 2, 2) / 2;
        currentW = lerp(maxW, minW, easeEncode);
        currentH = lerp(maxH, minH, easeEncode);
        dataTransition = t_encode; // 0 = Spectro, 1 = Latent
      } else {
        // Expanding
        const easeDecode = t_decode < 0.5 ? 2 * t_decode * t_decode : 1 - Math.pow(-2 * t_decode + 2, 2) / 2;
        currentW = lerp(minW, maxW, easeDecode);
        currentH = lerp(minH, maxH, easeDecode);
        dataTransition = 1 - easeDecode; // 1 = Latent, 0 = Reconstructed
      }

      const startX = (width - currentW) / 2;
      const startY = (height - currentH) / 2;
      
      const cellW = currentW / COLS;
      const cellH = currentH / ROWS;

      // Draw the neural network "connecting lines" background to emphasize architecture
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = '#4b5563';
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (p > 5 && p < 95) {
          // Draw faint funnel lines
          ctx.moveTo((width - maxW)/2, (height - maxH)/2);
          ctx.lineTo((width - minW)/2, (height - minH)/2);
          ctx.lineTo((width + minW)/2, (height - minH)/2);
          ctx.lineTo((width + maxW)/2, (height - maxH)/2);
          
          ctx.moveTo((width - maxW)/2, (height + maxH)/2);
          ctx.lineTo((width - minW)/2, (height + minH)/2);
          ctx.lineTo((width + minW)/2, (height + minH)/2);
          ctx.lineTo((width + maxW)/2, (height + maxH)/2);
      }
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      // Draw the actual data passing through the bottleneck
      for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS; r++) {
          let originalVal = spectroData[c][r];
          
          // Reconstructed data is slightly "smoothed" or noisy to represent lossy VAE
          let reconstructedVal = originalVal * 0.85 + Math.sin(r*0.5 + c*0.5)*0.1;
          
          // What value are we rendering based on the phase?
          let targetVal;
          if (!isDecoding) {
            targetVal = originalVal;
          } else {
            targetVal = reconstructedVal;
          }

          // Latent bottleneck value for this column
          let bottleneckVal = latentData[c];

          // Blend between the 2D image value and the 1D bottleneck value
          let finalVal = lerp(targetVal, bottleneckVal, dataTransition);

          // Get colors (blend palettes too!)
          const [r_spec, g_spec, b_spec] = getSpectroColor(finalVal);
          const [r_lat, g_lat, b_lat] = getLatentColor(finalVal);
          
          const finalR = lerp(r_spec, r_lat, dataTransition);
          const finalG = lerp(g_spec, g_lat, dataTransition);
          const finalB = lerp(b_spec, b_lat, dataTransition);

          ctx.fillStyle = `rgb(${finalR}, ${finalG}, ${finalB})`;
          
          // In latent phase, visual blocks should look like a discrete 1D array
          if (dataTransition > 0.8) {
             // Draw vertical 1D strips, skipping rows so it looks unified vertically
             if (r === 0) {
                 ctx.fillRect(startX + c * cellW, startY, cellW - 0.5, currentH);
             }
          } else {
             // Normal 2D grid rendering
             ctx.fillRect(startX + c * cellW, startY + r * cellH, cellW + 0.5, cellH + 0.5);
          }
        }
      }

      // Draw Labels
      ctx.fillStyle = '#9ca3af';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      
      if (p < 30) {
        ctx.fillText("80x256 Mel-Spectrogram", width/2, startY - 20);
      } else if (p >= 30 && p < 50) {
        ctx.fillText("Encoder compressing dimensions...", width/2, startY - 20);
      } else if (p >= 50 && p < 70) {
        ctx.fillStyle = '#4ade80'; // Green
        ctx.fillText("1D Latent Vector (Size: 256)", width/2, startY - 20);
        ctx.fillText("→ Sent to Normalizing Flow →", width/2, startY + currentH + 30);
      } else if (p >= 70 && p < 90) {
        ctx.fillText("Decoder expanding dimensions...", width/2, startY - 20);
      } else {
        ctx.fillText("Reconstructed 80x256 Mel-Spectrogram", width/2, startY - 20);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const stage = getStageInfo(progress);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans p-4 md:p-8">
      
      <div className="max-w-5xl mx-auto w-full mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-green-400 to-orange-400 text-transparent bg-clip-text">
          VAE Bottleneck Visualizer
        </h1>
        <p className="text-gray-400 mt-2">
          Understanding Step 3: Why we need a Variational Autoencoder (VAE) before the Normalizing Flow.
        </p>
      </div>

      <div className="max-w-5xl mx-auto w-full flex-grow flex flex-col relative mb-8">
        <div className="w-full h-72 md:h-[28rem] bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden relative">
          <canvas ref={canvasRef} className="w-full h-full block" />
          
          <div className="absolute top-4 left-4 bg-gray-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-700/50 flex items-center gap-2">
            {stage.icon}
            <span className="font-semibold text-sm tracking-wide">{stage.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-8">
        
        {/* Slider */}
        <div className="relative pt-6 pb-2">
          <div className="absolute w-full flex justify-between px-2 top-0 text-xs text-gray-500 font-medium">
            <span>Input</span>
            <span>Encode</span>
            <span className="text-green-400/70 font-bold">Bottleneck</span>
            <span>Decode</span>
            <span>Output</span>
          </div>
          
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500/50"
            style={{
              background: `linear-gradient(to right, 
                #a855f7 ${clamp(progress, 0, 25)}%, 
                #22d3ee ${clamp(progress, 25, 50)}%, 
                #4ade80 ${clamp(progress, 50, 75)}%, 
                #fb923c ${clamp(progress, 75, 100)}%, 
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

        {/* Quick jump buttons */}
        <div className="flex justify-between items-center gap-2 pt-4 flex-wrap sm:flex-nowrap">
          <button onClick={() => setProgress(0)} className="px-4 py-2 text-sm bg-gray-900 hover:bg-gray-800 rounded-lg text-purple-400 transition-colors border border-gray-800">1. Original Image</button>
          <ChevronRight className="w-4 h-4 text-gray-700 hidden sm:block" />
          <button onClick={() => setProgress(35)} className="px-4 py-2 text-sm bg-gray-900 hover:bg-gray-800 rounded-lg text-cyan-400 transition-colors border border-gray-800">2. Encode</button>
          <ChevronRight className="w-4 h-4 text-gray-700 hidden sm:block" />
          <button onClick={() => setProgress(55)} className="px-4 py-2 text-sm bg-green-900/20 hover:bg-green-900/40 rounded-lg text-green-400 transition-colors border border-green-800/50 font-bold">3. Latent Space</button>
          <ChevronRight className="w-4 h-4 text-gray-700 hidden sm:block" />
          <button onClick={() => setProgress(75)} className="px-4 py-2 text-sm bg-gray-900 hover:bg-gray-800 rounded-lg text-orange-400 transition-colors border border-gray-800">4. Decode</button>
          <ChevronRight className="w-4 h-4 text-gray-700 hidden sm:block" />
          <button onClick={() => setProgress(100)} className="px-4 py-2 text-sm bg-gray-900 hover:bg-gray-800 rounded-lg text-yellow-400 transition-colors border border-gray-800">5. Output</button>
        </div>

      </div>
    </div>
  );
}