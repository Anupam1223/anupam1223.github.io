import { generateGaussianPath, generateComplexPath } from './helpers';

export const meta = {
  title: "3. Latent Space (Z) vs Data Space (X)",
  subtitle: "The Factory Default vs. The Real World",
};

export default function Section03() {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">We are working with two different "worlds" or spaces.</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100 flex flex-col items-center">
          <h4 className="font-bold text-indigo-800 mb-2">Latent Space (Z)</h4>
          <p className="text-xs text-indigo-600 mb-4 text-center">The "Base Distribution". Simple, cheap, standard bell curve.</p>
          <svg viewBox="0 0 200 100" className="w-full">
            <path d={generateGaussianPath(0, 1, 80, 200, 100)} fill="#c7d2fe" stroke="#4f46e5" strokeWidth="2" />
          </svg>
          <p className="text-xs mt-4 text-gray-600 text-center">Like a perfectly smooth, unformed ball of clay. Easy to grab a piece from the middle.</p>
        </div>
        <div className="bg-rose-50 rounded-lg p-4 border border-rose-100 flex flex-col items-center">
          <h4 className="font-bold text-rose-800 mb-2">Data Space (X)</h4>
          <p className="text-xs text-rose-600 mb-4 text-center">The "Target Distribution". Real data (like human speech or images).</p>
          <svg viewBox="0 0 200 100" className="w-full">
            <path d={generateComplexPath(200, 100)} fill="#fecdd3" stroke="#e11d48" strokeWidth="2" />
          </svg>
          <p className="text-xs mt-4 text-gray-600 text-center">Highly complex, "multimodal" (many peaks). You can't describe this with a simple equation.</p>
        </div>
      </div>
    </div>
  );
}
