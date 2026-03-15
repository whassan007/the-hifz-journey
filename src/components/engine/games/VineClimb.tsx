import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GameComponentProps } from '../GameWrapper';
import { MOCK_QUESTIONS } from '../../../data/mockQuestions';
import { audioEngine, triggerHaptic } from '../../../audio';
import { Flower2 } from 'lucide-react';

export const VineClimb = ({ mode, audioEnabled, hapticEnabled, onVictory }: GameComponentProps) => {
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [isWrong, setIsWrong] = useState(false);
  const [missCount, setMissCount] = useState(0);

  const currentData = MOCK_QUESTIONS[mode as keyof typeof MOCK_QUESTIONS] as { words: string[] };

  const handleTapWord = (word: string) => {
    if (placedWords.includes(word)) return;
    const newPlaced = [...placedWords, word];
    setPlacedWords(newPlaced);
    triggerHaptic(hapticEnabled, 'light');
    
    if (newPlaced.length === currentData.words.length) {
      if (newPlaced.join(' ') === currentData.words.join(' ')) {
        audioEngine.playChime(audioEnabled);
        triggerHaptic(hapticEnabled, 'success');
        onVictory(40, missCount);
      } else {
        audioEngine.playThud(audioEnabled);
        triggerHaptic(hapticEnabled, 'error');
        setMissCount(p => p + 1);
        setIsWrong(true);
        setTimeout(() => {
          setIsWrong(false);
          setPlacedWords([]);
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#2F4F2F]/20 to-transparent pointer-events-none rounded-3xl" />
      
      {/* Jungle Canopy / Hanging Vines */}
      <div className="flex-1 relative flex items-start justify-center pt-8 overflow-hidden">
        {currentData.words.map((w: string, i: number) => {
          const isPlaced = placedWords.includes(w);
          const dropHeight = (i % 3) * 30 + 20; // Staggered heights
          
          return (
            <div key={i} className="flex flex-col items-center mx-2" style={{ marginTop: `${dropHeight}px` }}>
              {/* The Vine Line */}
              <div className={`w-1 bg-[#4CAF50]/40 rounded-full transition-all duration-700 ${isPlaced ? 'h-0 opacity-0' : 'h-24 opacity-100'}`} />
              
              <button 
                disabled={isPlaced}
                onClick={() => handleTapWord(w)}
                className={`relative px-4 py-3 rounded-2xl bg-[#3C5B3E] border-2 border-[#8B5A2B] text-paper font-arabic text-2xl font-bold font-bold transition-all shadow-lg ${isPlaced ? 'opacity-0 scale-50 -translate-y-10' : 'hover:bg-[#4CAF50] active:scale-95'}`}
              >
                {/* Decorative leaves */}
                <Flower2 size={12} className="absolute -top-2 -right-2 text-[#4CAF50]" />
                <Flower2 size={12} className="absolute -bottom-2 -left-2 text-[#4CAF50]" />
                {w}
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center mt-auto pb-4 z-10">
        <p className="text-center text-[#4CAF50] text-xs font-bold uppercase tracking-widest mb-4">اجمع الكلمات لبناء الآية والتسلق</p>
        
        {/* Assembly Bar */}
        <div className={`w-full max-w-lg p-6 rounded-3xl border-b-4 bg-[#8B5A2B]/40 backdrop-blur-md min-h-[140px] flex flex-wrap gap-3 justify-center items-center transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${isWrong ? 'border-red-500 bg-red-900/40 animate-shake' : placedWords.length === currentData.words.length && !isWrong ? 'border-[#4CAF50] bg-[#4CAF50]/40' : 'border-[#8B5A2B]'}`}>
          {placedWords.length === 0 && !isWrong && <span className="text-paper/40 font-bold uppercase tracking-widest text-sm">جذع التجميع</span>}
          {placedWords.map((w, i) => (
            <motion.div key={i} initial={{ scale: 0, y: -20 }} animate={{ scale: 1, y: 0 }} className="px-5 py-3 bg-[#4CAF50] text-white rounded-xl font-arabic text-3xl font-bold shadow-md">
              {w}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
