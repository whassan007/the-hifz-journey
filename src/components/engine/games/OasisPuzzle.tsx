import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Droplets } from 'lucide-react';
import type { GameComponentProps } from '../GameWrapper';
import { MOCK_QUESTIONS } from '../../../data/mockQuestions';
import { audioEngine, triggerHaptic } from '../../../audio';

export const OasisPuzzle = ({ mode, audioEnabled, hapticEnabled, onVictory }: GameComponentProps) => {
  const [placedFragments, setPlacedFragments] = useState<string[]>([]);
  const [isWrong, setIsWrong] = useState(false);
  const [missCount, setMissCount] = useState(0);

  const currentData = MOCK_QUESTIONS[mode as keyof typeof MOCK_QUESTIONS] as any;

  const handleFragmentTap = (fragment: string) => {
    if (placedFragments.includes(fragment)) return;
    const newPlaced = [...placedFragments, fragment];
    setPlacedFragments(newPlaced);
    triggerHaptic(hapticEnabled, 'light');
    
    if (newPlaced.length === currentData.correctOrder.length) {
      if (newPlaced.join(' ') === currentData.correctOrder.join(' ')) {
        audioEngine.playChime(audioEnabled);
        triggerHaptic(hapticEnabled, 'success');
        onVictory(50, missCount);
      } else {
        audioEngine.playThud(audioEnabled);
        triggerHaptic(hapticEnabled, 'error');
        setMissCount(p => p + 1);
        setIsWrong(true);
        setTimeout(() => {
          setIsWrong(false);
          setPlacedFragments([]);
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 justify-center relative">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Droplets size={24} className="text-[#00BCD4]" />
        <p className="text-[#00BCD4] text-xs font-bold uppercase tracking-widest">تجميع الشظايا المائية</p>
      </div>
      <p className="text-center text-paper/70 text-sm mb-8 px-4">تم كسر الآية إلى مجموعات. أعد ترتيب أجزاء الآية لتكوين السرب المتصل.</p>
      
      {/* Assembly Area (The Pond) */}
      <div className={`p-8 rounded-[3rem] border border-[#00BCD4]/30 min-h-[180px] mb-12 flex flex-wrap gap-2 justify-center items-center transition-all bg-gradient-to-br shadow-[inset_0_0_50px_rgba(0,188,212,0.1)] backdrop-blur-md ${isWrong ? 'from-red-900/20 to-transparent border-red-500/50 animate-shake' : placedFragments.length === currentData.correctOrder.length && !isWrong ? 'from-[#00BCD4]/20 to-[#00BCD4]/5 border-[#00BCD4]/80' : 'from-blue-900/10 to-transparent'}`}>
        {placedFragments.length === 0 && !isWrong && <span className="text-[#00BCD4]/40 font-bold tracking-widest">بحيرة التجميع</span>}
        {placedFragments.map((f, i) => (
          <motion.div key={i} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="px-5 py-2.5 bg-[#00BCD4]/20 border border-[#00BCD4]/50 text-[#E0F7FA] rounded-full font-arabic text-2xl font-bold shadow-lg flex items-center justify-center">
            {f}
          </motion.div>
        ))}
      </div>

      {/* Floating Fragments */}
      <div className="flex flex-wrap gap-4 justify-center">
        {currentData.fragments.map((f: string, i: number) => {
          const isPlaced = placedFragments.includes(f);
          return (
            <button 
              key={i} 
              disabled={isPlaced}
              onClick={() => handleFragmentTap(f)}
              className={`px-6 py-3 rounded-2xl border text-paper font-arabic text-xl font-bold transition-all shadow-md backdrop-blur-md ${isPlaced ? 'opacity-0 scale-50' : 'bg-black/40 border-[#00BCD4]/40 hover:bg-[#00BCD4]/30 active:scale-95 hover:border-[#00BCD4]'}`}
            >
              {f}
            </button>
          );
        })}
      </div>
      
      <div className="absolute top-0 right-0 p-2">
         <button className="text-[#00BCD4]/40 hover:text-[#00BCD4] transition-colors active:scale-95 bg-black/20 p-2 rounded-full border border-white/5">
          <Volume2 size={20} />
        </button>
      </div>
    </div>
  );
};
