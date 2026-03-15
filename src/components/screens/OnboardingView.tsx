import { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

interface OnboardingProps {
  onComplete: (name: string) => void;
}

export const OnboardingView = ({ onComplete }: OnboardingProps) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 w-full max-w-md mx-auto relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full shadow-2xl flex flex-col items-center"
      >
        <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-6 border border-accent/40 shadow-[0_0_30px_rgba(217,119,6,0.3)]">
          <Leaf className="text-accent" size={40} />
        </div>
        
        <h1 className="text-3xl font-black mb-2 text-paper text-center">رحلة الحفظ</h1>
        <p className="text-paper/60 text-center mb-8 text-sm">أدخل اسمك لتبدأ مسيرتك في حفظ ومراجعة القرآن الكريم بأسلوب تفاعلي.</p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="text"
            dir="rtl"
            placeholder="الاسم الكريم..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-xl font-bold font-arabic text-paper outline-none focus:border-accent transition-colors text-center"
            autoFocus
          />
          <button 
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-gradient-to-r from-accent to-orange-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg mt-2 transition-all active:scale-95"
          >
            بدء الرحلة ←
          </button>
        </form>
      </motion.div>
    </div>
  );
};
