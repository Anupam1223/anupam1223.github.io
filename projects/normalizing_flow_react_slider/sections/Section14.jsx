import { ArrowRight } from 'lucide-react';

export const meta = {
  title: "14. The Math Trick: Forward vs Inverse",
  subtitle: "Flipping the Jacobian and preparing for the Log.",
  titlePyTorch: "14. Natively Forward in PyTorch",
  subtitlePyTorch: "Why we don't need the textbook flip trick.",
};

export default function Section14({ formulaView, renderFormulaToggle }) {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        Before we look at the final formula, we must solve the "Plus vs Minus" mystery. Toggle below to see the two different ways to calculate the stretch!
      </p>
      {renderFormulaToggle()}
      {formulaView === 'textbook' ? (
        <div className="animate-fade-in">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-indigo-800 border-b border-indigo-100 pb-2 mb-3">Trick 1: The Forward Flip</h4>
            <p className="text-sm text-gray-600 mb-3">
              The textbook assumes we are going backward from X to Z. Calculating this inverse math is hard. So, mathematicians take the easy forward stretch and stick a <strong>-1 exponent</strong> on it to flip it upside down.
            </p>
            <div className="flex items-center justify-center gap-4 bg-slate-50 p-4 rounded-lg font-mono text-sm">
              <div className="text-center">
                <span className="block text-gray-500 text-[10px] uppercase mb-1">Inverse (Hard)</span>
                <span className="text-rose-600 font-bold">|det(∂z/∂x)|</span>
              </div>
              <div className="text-gray-400 font-bold text-lg">=</div>
              <div className="text-center">
                <span className="block text-gray-500 text-[10px] uppercase mb-1">Forward (Easy)</span>
                <span className="text-indigo-600 font-bold">|det(∂x/∂z)|<sup className="text-gray-500 ml-1">-1</sup></span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2 font-mono">Example: "Divide by 2" is the exact same thing as "Multiply by 2<sup className="ml-0.5">-1</sup>"</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mt-4">
            <h4 className="font-bold text-teal-800 border-b border-teal-100 pb-2 mb-3">Trick 2: The Logarithm Magic</h4>
            <p className="text-sm text-gray-600 mb-3">
              To prevent computer memory crashes (underflow), we slap a <code>log()</code> onto the formula. Logarithms automatically drop that <strong>-1</strong> exponent down to the front, turning addition into a minus sign!
            </p>
            <div className="bg-teal-50 p-4 rounded-lg flex flex-col gap-2">
              <div className="font-mono text-sm text-gray-500 flex justify-between items-center">
                <span>Original:</span>
                <span>p_x(x) <strong className="text-teal-500">=</strong> p_z(z) <strong className="text-teal-500">×</strong> |det(J)|<strong className="text-teal-500"><sup>-1</sup></strong></span>
              </div>
              <ArrowRight className="text-teal-300 mx-auto rotate-90" size={16}/>
              <div className="font-mono text-sm font-bold text-teal-800 flex justify-between items-center">
                <span>With Log:</span>
                <span>log p_x(x) <strong className="text-teal-500">=</strong> log p_z(z) <strong className="text-rose-500">-</strong> log |det(J)|</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-teal-800 border-b border-teal-100 pb-2 mb-3">No Flipping Required!</h4>
            <p className="text-sm text-gray-600 mb-3">
              During training, PyTorch naturally feeds data from <strong>X to Z</strong>. This means it is natively calculating the stretch in the correct training direction!
            </p>
            <div className="flex items-center justify-center gap-4 bg-slate-50 p-4 rounded-lg font-mono text-sm">
              <div className="text-center">
                <span className="block text-gray-500 text-[10px] uppercase mb-1">PyTorch Stretch (Training)</span>
                <span className="text-teal-600 font-bold">|det(∂z/∂x)|</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">Because we don't have to flip the equation upside down, there is no -1 exponent!</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mt-4">
            <h4 className="font-bold text-indigo-800 border-b border-indigo-100 pb-2 mb-3">The Logarithm Addition</h4>
            <p className="text-sm text-gray-600 mb-3">
              Just like before, we apply the <code>log()</code> to prevent underflow. Because there is no -1 exponent to drop down, the multiplication simply turns into standard addition.
            </p>
            <div className="bg-teal-50 p-4 rounded-lg flex flex-col gap-2">
              <div className="font-mono text-sm text-gray-500 flex justify-between items-center">
                <span>Original:</span>
                <span>p_x(x) <strong className="text-teal-500">=</strong> p_z(z) <strong className="text-teal-500">×</strong> |det(J)|</span>
              </div>
              <ArrowRight className="text-teal-300 mx-auto rotate-90" size={16}/>
              <div className="font-mono text-sm font-bold text-teal-800 flex justify-between items-center">
                <span>With Log:</span>
                <span>log p_x(x) <strong className="text-teal-500">=</strong> log p_z(z) <strong className="text-teal-500">+</strong> log |det(J)|</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
