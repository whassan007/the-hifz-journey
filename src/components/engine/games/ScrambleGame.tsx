import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import type { GameComponentProps } from '../GameWrapper';
import { audioEngine, triggerHaptic } from '../../../audio';
import { getSafeVerses, getAlwaysExcludedPhrases } from '../../../services/verseUniquenessValidator';

interface ScrambleWord {
  id: string;
  text: string;
}

export const ScrambleGame = ({ surah, audioEnabled, hapticEnabled, onVictory }: GameComponentProps) => {
  const [gameData] = useState(() => {
    // 1. Select the best verse
    const safe = getSafeVerses(surah.id);
    const candidates = safe.filter(v => {
      const wordCount = v.verseText.trim().split(/\s+/).length;
      return wordCount >= 4 && wordCount <= 12;
    });

    let selectedVerse = candidates[0];
    if (candidates.length === 0) {
      // Fallback
      selectedVerse = safe
        .filter(v => v.verseText.trim().split(/\s+/).length <= 15)
        .sort((a, b) => b.verseText.length - a.verseText.length)[0];
      if (!selectedVerse) throw new Error(`No valid word-order verse for surah ${surah.id}`);
    } else {
      const preferred = candidates.filter(v => {
        const wc = v.verseText.trim().split(/\s+/).length;
        return wc >= 5 && wc <= 8;
      });
      const pool = preferred.length > 0 ? preferred : candidates;
      selectedVerse = pool[Math.floor(Math.random() * pool.length)];
    }

    // 2. Build game
    const rawWords = selectedVerse.verseText.trim().split(/\s+/);
    if (rawWords.length < 3) throw new Error('Verse too short for word order game');
    
    const wordsObj = rawWords.map((text, i) => ({ id: `w_${i}`, text }));
    
    const shuffle = (array: ScrambleWord[]) => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    let shuffledObj = shuffle(wordsObj);
    while (shuffledObj.map(w => w.id).join(',') === wordsObj.map(w => w.id).join(',')) {
      shuffledObj = shuffle(wordsObj);
    }

    return { words: wordsObj, shuffled: shuffledObj, verseText: selectedVerse.verseText, verseNumber: selectedVerse.verseNumber };
  });

  // Assertion to catch forbidden text in Dev
  if (import.meta.env?.DEV) {
    const FORBIDDEN = getAlwaysExcludedPhrases();
    const hasForbidden = FORBIDDEN.some(f => gameData.verseText.includes(f));
    console.assert(!hasForbidden, `WordOrderGame received forbidden verse content for surah ${surah.id}: "${gameData.verseText}"`);
  }

  const [placedWords, setPlacedWords] = useState<ScrambleWord[]>([]);
  const [isWrong, setIsWrong] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [missCount, setMissCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const handleScrambleWord = (word: ScrambleWord) => {
    if (placedWords.some(w => w.id === word.id) || isCorrect) return;
    
    const newPlaced = [...placedWords, word];
    setPlacedWords(newPlaced);
    triggerHaptic(hapticEnabled, 'light');
    setShowHint(false); // turn off hint when interacting
    
    if (newPlaced.length === gameData.words.length) {
      if (newPlaced.map(w => w.id).join('') === gameData.words.map(w => w.id).join('')) {
        audioEngine.playChime(audioEnabled);
        triggerHaptic(hapticEnabled, 'success');
        setIsCorrect(true);
        setTimeout(() => {
          onVictory(30, missCount > 0 ? missCount - 1 : 0); // No penalty for first mistake natively handled this way
        }, 1500);
      } else {
        audioEngine.playThud(audioEnabled);
        triggerHaptic(hapticEnabled, 'error');
        setMissCount(p => p + 1);
        setIsWrong(true);
        setTimeout(() => setIsWrong(false), 800);
      }
    }
  };

  const handleRemoveWord = (wordId: string) => {
    if (isCorrect) return;
    setPlacedWords(prev => prev.filter(w => w.id !== wordId));
    triggerHaptic(hapticEnabled, 'light');
  };

  const nextCorrectIndex = placedWords.length;
  const nextCorrectWord = gameData.words[nextCorrectIndex];

  return (
    <div className="flex flex-col flex-1 justify-center" dir="rtl">
      
      {/* Target Setup */}
      <p className="text-center text-paper/50 text-xs font-bold uppercase tracking-widest mb-8">
        كون الآية {gameData.verseNumber} بالترتيب الصحيح
      </p>
      
      {/* Drop Zone */}
      <div 
        dir="rtl"
        className={`p-6 rounded-3xl border-2 min-h-[160px] mb-8 flex flex-row flex-wrap gap-3 justify-start items-start transition-all shadow-inner backdrop-blur-sm relative overflow-hidden
          ${isWrong ? 'border-[#B35E4C] bg-[#B35E4C]/10 animate-shake' : 
            isCorrect ? 'border-[#3C5B3E] bg-[#3C5B3E]/10' : 
            'border-dashed border-white/20 bg-black/20'}`}
      >
        {isCorrect && (
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: '-100%' }} transition={{ duration: 1.5, ease: 'linear' }}
            className="absolute inset-0 bg-green-500/20 mix-blend-overlay z-0 pointer-events-none"
          />
        )}
        
        <AnimatePresence>
          {placedWords.length === 0 && !isWrong && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center text-paper/30 truncate pointer-events-none text-xl">
              منطقة الإسقاط
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {placedWords.map((w) => (
            <motion.button 
              key={w.id} 
              initial={{ scale: 0, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => handleRemoveWord(w.id)}
              className="px-5 py-3 bg-gradient-to-br from-accent to-[#8B5A2B] text-paper rounded-2xl font-arabic text-3xl font-bold shadow-lg z-10 active:scale-95 transition-transform whitespace-nowrap"
            >
              {w.text}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {missCount >= 3 && !isCorrect && (
         <div className="flex justify-center mb-6">
           <button 
             onClick={() => setShowHint(true)}
             className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-500 rounded-full font-bold text-sm border border-amber-500/30 hover:bg-amber-500/30 active:scale-95 transition-all"
           >
             <HelpCircle size={16} /> مساعدة
           </button>
         </div>
      )}

      {/* Chip Tray */}
      <div className="flex flex-row flex-wrap gap-4 justify-center" dir="rtl">
        {gameData.shuffled.map((w) => {
          const isPlaced = placedWords.some(placed => placed.id === w.id);
          const isHinted = showHint && w.id === nextCorrectWord?.id;
          
          return (
            <button 
              key={w.id} 
              disabled={isPlaced || isCorrect}
              onClick={() => handleScrambleWord(w)}
              className={`px-5 py-3 min-w-[3rem] text-center rounded-2xl border border-white/10 text-paper font-arabic text-[28px] leading-relaxed transition-all shadow-sm backdrop-blur-sm whitespace-nowrap
                ${isPlaced ? 'opacity-30 cursor-default grayscale' : 'bg-black/20 hover:bg-black/40 active:scale-95 cursor-pointer'}
                ${isHinted && !isPlaced ? 'border-amber-400 bg-amber-400/20 animate-pulse text-amber-50 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : ''}
              `}
            >
              {w.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};
