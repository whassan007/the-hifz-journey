/* eslint-disable local/no-hardcoded-arabic */
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GameComponentProps } from '../GameWrapper';
import { audioEngine, triggerHaptic } from '../../../audio';
import { getSafeVerses } from '../../../services/verseUniquenessValidator';

// Common Quranic verse endings for Mutashabihat trick options
const COMMON_ENDINGS = [
  "إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ",
  "إِنَّ اللَّهَ سَمِيعٌ عَلِيمٌ",
  "إِنَّ اللَّهَ عَزِيزٌ حَكِيمٌ",
  "وَاللَّهُ بِمَا تَعْمَلُونَ خَبِيرٌ",
  "وَاللَّهُ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
  "إِنَّهُ حَمِيدٌ مَجِيدٌ",
  "أَلَا إِنَّ اللَّهَ هُوَ الْغَفُورُ الرَّحِيمُ",
  "وَكَانَ اللَّهُ غَفُورًا رَحِيمًا"
];

export const MutashabihatGame = ({ surah, audioEnabled, hapticEnabled, onVictory }: GameComponentProps) => {
  const [isWrong, setIsWrong] = useState(false);
  const [missCount, setMissCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [gameData] = useState(() => {
    // 1. Get safe verses for this Surah
    const safe = getSafeVerses(surah.id);
    const candidates = safe.filter(v => v.verseText.trim().split(/\s+/).length >= 7);
    const selectedVerse = candidates.length > 0 
      ? candidates[Math.floor(Math.random() * candidates.length)] 
      : safe[Math.floor(Math.random() * safe.length)];

    const words = selectedVerse.verseText.trim().split(/\s+/);
    // Take the last 3 words as the mutashabihat target
    const targetLength = Math.min(3, Math.max(2, Math.floor(words.length * 0.3)));
    
    const beginning = words.slice(0, words.length - targetLength).join(' ');
    const actualEnding = words.slice(words.length - targetLength).join(' ');

    // Generate 3 fake options from common endings or random safe verses
    const options = new Set<string>();
    options.add(actualEnding);

    // Try to add some common trick endings
    while (options.size < 4) {
      const trick = COMMON_ENDINGS[Math.floor(Math.random() * COMMON_ENDINGS.length)];
      if (trick !== actualEnding) {
        options.add(trick);
      }
    }

    const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

    return {
      beginning,
      actualEnding,
      options: shuffledOptions,
      verseNumber: selectedVerse.verseNumber
    };
  });

  const handleAnswer = (opt: string) => {
    if (selectedOption) return;
    setSelectedOption(opt);
    
    if (opt === gameData.actualEnding) {
      audioEngine.playChime(audioEnabled);
      triggerHaptic(hapticEnabled, 'success');
      setTimeout(() => {
        onVictory(30, missCount);
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
      
      <div className="bg-black/20 border border-[#B0A8C9]/30 rounded-full px-6 py-2 mb-8 shadow-[0_0_15px_rgba(176,168,201,0.2)]">
        <span className="text-sm font-bold text-[#B0A8C9] uppercase tracking-widest">تحدي المتشابهات</span>
      </div>

      <div className={`w-full bg-gradient-to-b from-black/30 to-black/10 rounded-[2.5rem] border border-white/5 p-8 mb-8 text-center relative overflow-hidden shadow-inner transition-colors duration-300 ${isWrong ? 'border-red-500/50 bg-red-500/10' : ''}`}>
        <p className="font-arabic text-3xl leading-loose text-paper" dir="rtl">
          {gameData.beginning} <span className="text-[#B0A8C9] bg-[#B0A8C9]/10 px-4 rounded-lg select-none blur-[2px] animate-pulse">______</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 w-full" dir="rtl">
        {gameData.options.map((opt) => {
          const isSelected = selectedOption === opt;
          const isCorrect = opt === gameData.actualEnding;
          
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
