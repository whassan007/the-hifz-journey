import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import type { GameComponentProps } from '../GameWrapper';

interface ScrambleData {
  words: string[];
  translation: string;
}
import { MOCK_QUESTIONS } from '../../../data/mockQuestions';
import { audioEngine, triggerHaptic } from '../../../audio';

export const ScrambleGame = ({ mode, audioEnabled, hapticEnabled, onVictory }: GameComponentProps) => {
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [isWrong, setIsWrong] = useState(false);
  const [missCount, setMissCount] = useState(0);

  const currentData = MOCK_QUESTIONS[mode as keyof typeof MOCK_QUESTIONS] as ScrambleData;

  const handleScrambleWord = (word: string) => {
    if (placedWords.includes(word)) return;
    const newPlaced = [...placedWords, word];
    setPlacedWords(newPlaced);
    triggerHaptic(hapticEnabled, 'light');
    
    if (newPlaced.length === currentData.words.length) {
      if (newPlaced.join('') === currentData.words.join('')) {
        audioEngine.playChime(audioEnabled);
        triggerHaptic(hapticEnabled, 'success');
        onVictory(30, missCount);
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
    <div className="flex flex-col flex-1 justify-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <p className="text-center text-paper/80 italic text-lg">"{currentData.translation}"</p>
        <button className="text-paper/40 hover:text-accent transition-colors active:scale-95 bg-black/20 p-1.5 rounded-full border border-white/5">
          <Volume2 size={16} />
        </button>
      </div>
      <p className="text-center text-paper/50 text-xs font-bold uppercase tracking-widest mb-8">اضغط على الكلمات بالترتيب الصحيح</p>
      
      <div className={`p-6 rounded-3xl border-2 min-h-[160px] mb-12 flex flex-wrap gap-3 justify-center items-center transition-all shadow-inner backdrop-blur-sm ${isWrong ? 'border-[#B35E4C] bg-[#B35E4C]/10 animate-shake' : placedWords.length === currentData.words.length && !isWrong ? 'border-[#3C5B3E] bg-[#3C5B3E]/10' : 'border-dashed border-white/20 bg-black/20'}`}>
        {placedWords.length === 0 && !isWrong && <span className="text-paper/30 truncate">منطقة الإسقاط</span>}
        {placedWords.map((w, i) => (
          <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} className="px-5 py-3 bg-gradient-to-br from-accent to-[#8B5A2B] text-paper rounded-2xl font-arabic text-3xl font-bold shadow-lg">
            {w}
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {currentData.words.map((w: string, i: number) => {
          const isPlaced = placedWords.includes(w);
          return (
            <button 
              key={i} 
              disabled={isPlaced}
              onClick={() => handleScrambleWord(w)}
              className={`px-6 py-4 rounded-2xl border border-white/10 text-paper font-arabic text-3xl font-bold transition-all shadow-sm backdrop-blur-sm ${isPlaced ? 'opacity-0 scale-50' : 'bg-black/20 hover:bg-black/40 active:scale-95'}`}
            >
              {w}
            </button>
          );
        })}
      </div>
    </div>
  );
};
