import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface ProgressiveMaskingProps {
  text: string;
  stage: 1 | 2 | 3 | 4 | 5; 
  fadeLevel: number; // 0 to 100
}

export const ProgressiveMasking: React.FC<ProgressiveMaskingProps> = ({ text, stage, fadeLevel }) => {
  const words = text.split(' ').filter(w => w.trim().length > 0);
  const [fadedIndices, setFadedIndices] = useState<number[]>([]);

  useEffect(() => {
    const fadeCount = Math.floor((fadeLevel / 100) * words.length);
    if (fadeCount === 0) {
      if (fadedIndices.length > 0) {
        setFadedIndices([]);
      }
      return;
    }
    
    // Pick random indices to fade out
    setFadedIndices(prev => {
      // Keep previously faded, add new ones randomly
      const newCount = fadeCount - prev.length;
      if (newCount <= 0) return prev;
      
      const available = words.map((_, i) => i).filter(i => !prev.includes(i));
      const shuffled = available.sort(() => 0.5 - Math.random());
      return [...prev, ...shuffled.slice(0, newCount)];
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fadeLevel]);

  const stripTashkeel = (word: string, currentStage: number) => {
    let result = word;
    if (currentStage >= 2) {
      result = result.replace(/[\u064B-\u064D]/g, ''); // tanween
    }
    if (currentStage >= 3) {
      result = result.replace(/[\u064E-\u0650]/g, ''); // short vowels
    }
    if (currentStage >= 4) {
      result = result.replace(/[\u0651\u0652\u0670]/g, ''); // shadda, sukun, dagger
    }
    if (currentStage >= 5) {
      result = result.replace(/[\u064B-\u065F\u0670-\u06D3]/g, ''); // all marks
    }
    return result;
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center leading-loose font-arabic text-3xl md:text-4xl" dir="rtl">
      {words.map((w, i) => {
        const isFaded = fadedIndices.includes(i);
        const displayWord = stripTashkeel(w, stage);
        return (
          <motion.span 
            key={`${i}-${displayWord}`} 
            initial={{ opacity: 1 }}
            animate={{ opacity: isFaded ? 0.2 : 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block"
          >
            {displayWord}
          </motion.span>
        );
      })}
    </div>
  );
};
