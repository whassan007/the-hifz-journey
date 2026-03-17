import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SurahNode } from '../../../types';
import { Volume2, Mic, Eye, MoveRight } from 'lucide-react';
import { ProgressiveMasking } from './ProgressiveMasking';

interface DeepMemorizationFlowProps {
  surah: SurahNode;
  onComplete: (score: number) => void;
}

export const DeepMemorizationFlow: React.FC<DeepMemorizationFlowProps> = ({ surah, onComplete }) => {
  const [phase, setPhase] = useState<1|2|3|4|5|6>(1);
  const [verseIndex, setVerseIndex] = useState(0);
  const [fadeLevel, setFadeLevel] = useState(0);
  const fadeLevelRef = React.useRef(0);

  useEffect(() => {
    fadeLevelRef.current = fadeLevel;
  }, [fadeLevel]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let timer: any;
    if (phase === 4) {
      timer = setInterval(() => {
        if (fadeLevelRef.current >= 100) {
          clearInterval(timer);
        } else {
          setFadeLevel(prev => Math.min(prev + 25, 100)); // Fades completely over ~4 ticks
        }
      }, 2000);
    } 
    return () => clearInterval(timer);
  }, [phase, verseIndex]);

  const renderPhaseDetails = () => {
    switch(phase) {
      case 1: return <div className="text-xl text-accent flex items-center gap-2"><Volume2 /> استمع بانتباه</div>;
      case 2: return <div className="text-xl text-accent flex items-center gap-2"><Eye /> تتبع الكلمات</div>;
      case 3: return <div className="text-xl text-accent flex items-center gap-2"><Mic /> اقرأ مع النص</div>;
      case 4: return <div className="text-xl text-accent flex items-center gap-2"><Eye className="opacity-50" /> تذكر والكلمات تختفي</div>;
      case 5: return <div className="text-xl text-accent flex items-center gap-2"><Mic className="text-orange-400" /> اقرأ من الذاكرة</div>;
      case 6: return <div className="text-xl text-accent flex items-center gap-2"><MoveRight /> اربط الآية بما قبلها</div>;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-black/40 rounded-3xl p-8 backdrop-blur-md border border-white/10 text-center">
        <h2 className="text-2xl font-bold mb-4">الحفظ العميق (المرحلة {phase}/6)</h2>
        <div className="flex justify-center mb-10">
          {renderPhaseDetails()}
        </div>
        
        <div className="bg-white/5 p-8 rounded-2xl w-full min-h-[250px] flex items-center justify-center relative overflow-hidden mb-8 border border-white/5">
           <AnimatePresence mode="wait">
              <motion.div 
                key={phase + '-' + verseIndex} 
                initial={{opacity:0, scale:0.95}} 
                animate={{opacity:1, scale:1}} 
                exit={{opacity:0, scale:1.05}} 
                className="text-3xl md:text-4xl font-arabic leading-loose" 
                dir="rtl"
              >
                {phase === 4 ? (
                  <ProgressiveMasking text={surah.verses[verseIndex]} stage={1} fadeLevel={fadeLevel} />
                ) : phase === 5 ? (
                  <span className="text-paper/20 animate-pulse text-5xl">...</span>
                ) : phase === 6 ? (
                  <div className="flex flex-col gap-6">
                    {verseIndex > 0 && (
                      <motion.div initial={{opacity:0, y:-10}} animate={{opacity:0.5, y:0}} className="text-paper/50 text-xl border-b border-white/5 pb-4">
                        {surah.verses[verseIndex - 1]}
                      </motion.div>
                    )}
                    <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="text-accent font-bold">
                      {surah.verses[verseIndex]}
                    </motion.div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {surah.verses[verseIndex].split(' ').map((word, wIdx) => (
                      <motion.span
                        key={`${verseIndex}-${wIdx}`}
                        initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ 
                          delay: phase === 1 ? wIdx * 0.15 : phase === 2 ? wIdx * 0.1 : 0, 
                          duration: 0.5 
                        }}
                        className={`inline-block ${phase === 1 ? 'hover:text-amber-300 transition-colors' : phase === 2 ? 'text-amber-100 hover:scale-110 transition-transform cursor-pointer' : 'text-paper hover:text-white transition-colors'}`}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </div>
                )}
              </motion.div>
           </AnimatePresence>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => {
              setFadeLevel(0);
              fadeLevelRef.current = 0;
              if (phase < 6) setPhase((p) => (p + 1) as 1|2|3|4|5|6);
              else if (verseIndex < surah.verses.length - 1) { setPhase(1); setVerseIndex(i => i + 1); }
              else onComplete(100);
            }}
            className="bg-accent text-jungle-dark px-8 py-4 rounded-xl font-bold text-lg hover:bg-white transition-colors flex-1 shadow-lg shadow-accent/20"
          >
            {/* eslint-disable-next-line local/no-hardcoded-arabic */}
            {phase < 6 ? 'المرحلة التالية (Next Phase)' : (verseIndex < surah.verses.length - 1 ? 'الآية التالية (Next Verse)' : 'إنهاء التدريب (Finish)')}
          </button>
          
          {phase < 6 && verseIndex < surah.verses.length - 1 && (
            <button 
              onClick={() => {
                setFadeLevel(0);
                fadeLevelRef.current = 0;
                setPhase(1);
                setVerseIndex(i => i + 1);
              }}
              className="bg-white/10 text-paper px-6 py-4 rounded-xl font-bold hover:bg-white/20 transition-colors flex shrink-0 items-center justify-center border border-white/10"
            >
              {/* eslint-disable-next-line local/no-hardcoded-arabic */}
              تخطي للآية التالية ⏭
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
