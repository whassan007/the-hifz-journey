/* eslint-disable local/no-hardcoded-arabic */
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GameComponentProps } from '../GameWrapper';
import { audioEngine, triggerHaptic } from '../../../audio';
import { getSafeVerses } from '../../../services/verseUniquenessValidator';

export const FillBlankGame = ({ surah, audioEnabled, hapticEnabled, onVictory }: GameComponentProps) => {
  const [isWrong, setIsWrong] = useState(false);
  const [missCount, setMissCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [gameData] = useState(() => {
    // 1. Get safe verses and pick one > 5 words
    const safe = getSafeVerses(surah.id);
    const candidates = safe.filter(v => v.verseText.trim().split(/\s+/).length >= 5);
    const selectedVerse = candidates.length > 0 
      ? candidates[Math.floor(Math.random() * candidates.length)] 
      : safe[Math.floor(Math.random() * safe.length)];

    const words = selectedVerse.verseText.trim().split(/\s+/);
    
    // Pick 1 or 2 consecutive words to blank out, not at the very beginning or end if possible
    const maskLength = words.length > 8 ? 2 : 1;
    const startIndex = Math.max(1, Math.min(words.length - maskLength - 1, Math.floor(Math.random() * (words.length - maskLength))));
    
    const actualAnswer = words.slice(startIndex, startIndex + maskLength).join(' ');
    
    // Create the masked verse array
    const maskedWords = [...words];
    maskedWords.splice(startIndex, maskLength, '_____');
    const displayVerse = maskedWords.join(' ');

    // Generate 3 fake options from the same Surah to act as plausible distractors
    const options = new Set<string>();
    options.add(actualAnswer);

    let attempts = 0;
    while (options.size < 4 && attempts < 50) {
      attempts++;
      const randomVerse = safe[Math.floor(Math.random() * safe.length)];
      const randomWords = randomVerse.verseText.trim().split(/\s+/);
      if (randomWords.length >= maskLength) {
        const randStart = Math.floor(Math.random() * (randomWords.length - maskLength + 1));
        const fakeOpt = randomWords.slice(randStart, randStart + maskLength).join(' ');
        if (fakeOpt !== actualAnswer) {
          options.add(fakeOpt);
        }
      }
    }

    const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

    return {
      displayVerse,
      actualAnswer,
      options: shuffledOptions,
      verseNumber: selectedVerse.verseNumber
    };
  });

  const handleAnswer = (opt: string) => {
    if (selectedOption) return;
    setSelectedOption(opt);
    
    if (opt === gameData.actualAnswer) {
      audioEngine.playChime(audioEnabled);
      triggerHaptic(hapticEnabled, 'success');
      setTimeout(() => {
        onVictory(20, missCount);
      }, 1200);
    } else {
      audioEngine.playThud(audioEnabled);
      triggerHaptic(hapticEnabled, 'error');
      setMissCount(p => p + 1);
      setIsWrong(true);
      setTimeout(() => {
        setIsWrong(false);
        setSelectedOption(null);
      }, 800);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center w-full max-w-2xl mx-auto">
      
      <div className="bg-black/20 border border-[#FFC107]/30 rounded-full px-6 py-2 mb-8 shadow-[0_0_15px_rgba(255,193,7,0.2)]">
        <span className="text-sm font-bold text-[#FFC107] uppercase tracking-widest">أكمل الفراغ</span>
      </div>

      <div className={`w-full bg-gradient-to-b from-black/30 to-black/10 rounded-[2.5rem] border border-white/5 p-8 mb-8 text-center relative overflow-hidden shadow-inner transition-colors duration-300 ${isWrong ? 'border-red-500/50 bg-red-500/10' : ''}`}>
        <p className="font-arabic text-4xl leading-loose text-paper" dir="rtl">
          {gameData.displayVerse}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full" dir="rtl">
        {gameData.options.map((opt) => {
          const isSelected = selectedOption === opt;
          const isCorrect = opt === gameData.actualAnswer;
          
          let btnClass = "bg-white/5 border-white/10 hover:bg-white/10 text-paper/80";
          let animClass = "";
          
          if (isSelected) {
            if (isCorrect) {
              btnClass = "bg-[#3C5B3E] border-[#A4C3A2] text-paper shadow-lg shadow-[#3C5B3E]/50";
              animClass = "animate-bounce-in";
            } else {
              btnClass = "bg-[#B35E4C] border-[#D98977] text-paper";
              animClass = "animate-shake";
            }
          }

          return (
            <motion.button 
              key={opt}
              whileTap={{ scale: 0.97 }}
              disabled={!!selectedOption && isCorrect}
              onClick={() => handleAnswer(opt)}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-center font-arabic text-2xl backdrop-blur-sm cursor-pointer ${btnClass} ${animClass}`}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>

    </div>
  );
};
