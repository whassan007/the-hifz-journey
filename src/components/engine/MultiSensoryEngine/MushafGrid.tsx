import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SurahNode } from '../../../types';

interface MushafGridProps {
  surah: SurahNode;
  masteryData: unknown[];
  onComplete: () => void;
}

export const MushafGrid: React.FC<MushafGridProps> = ({ surah, onComplete }) => {
  const [selectedPage, setSelectedPage] = useState<number | null>(null);

  const getCellColor = (index: number) => {
    if (index % 17 === 0) return 'bg-red-500/50'; // critical
    if (index % 5 === 0) return 'bg-amber-500/50'; // weakening
    if (index % 3 === 0) return 'bg-teal-500/80'; // strong
    return 'bg-white/10'; // unlearned
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 text-center w-full h-full relative">
      <AnimatePresence mode="wait">
        {selectedPage === null ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full max-w-4xl bg-black/40 rounded-3xl p-6 backdrop-blur-md border border-white/10 flex flex-col"
            style={{ maxHeight: 'calc(100vh - 120px)' }}
          >
            <h2 className="text-2xl font-bold text-accent mb-2">شبكة المصحف التفاعلية</h2>
            <p className="text-paper/70 mb-4 text-sm">604 pages structured for spatial encoding. Colors indicate mastery.</p>
            
            <div className="flex-1 overflow-auto bg-black/20 rounded-xl p-4 border border-white/5 scrollbar-thin">
              <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1 md:gap-2 min-w-[600px] pb-4" dir="rtl">
                {Array.from({length: 604}).map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedPage(i + 1)}
                    className={`aspect-[3/4] ${getCellColor(i)} rounded-[2px] hover:scale-125 hover:z-10 transition-transform hover:ring-2 ring-white/50 relative group`}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/80 flex flex-col items-center justify-center text-[8px] md:text-[10px] font-bold rounded-[2px]">
                      {i + 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="shrink-0 mt-6 pb-2">
              <button onClick={onComplete} className="bg-white/10 text-paper px-8 py-3 rounded-xl hover:bg-white/20 transition-colors">
                إنهاء التدريب
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="page"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-2xl bg-black/60 rounded-3xl p-6 backdrop-blur-md border border-white/10 flex flex-col"
          >
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <button 
                onClick={() => setSelectedPage(null)}
                className="bg-white/10 px-4 py-2 rounded-lg text-sm hover:bg-white/20"
              >
                العودة للشبكة
              </button>
              <h2 className="text-xl font-bold text-accent">صفحة {selectedPage}</h2>
              <div className="w-24"></div>
            </div>

            <div className="bg-[#f4efe8] text-black rounded-lg p-6 font-arabic text-xl md:text-2xl leading-loose text-center shadow-inner relative overflow-hidden" dir="rtl">
              {Array.from({length: 15}).map((_, lineIdx) => {
                const isTargetLine = lineIdx === 7;
                return (
                  <div 
                    key={lineIdx} 
                    className={`border-b border-black/5 py-2 min-h-[3rem] flex items-center justify-center ${!isTargetLine ? 'bg-black text-transparent hover:bg-transparent hover:text-black hover:cursor-crosshair transition-all duration-300' : 'text-emerald-800 font-bold bg-emerald-500/10'}`}
                  >
                    {/* eslint-disable-next-line local/no-hardcoded-arabic */}
                    {isTargetLine ? (surah?.verses[0] || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ') : 'ــــــــــــــــــــــــــــــــــــــــــــــــ'}
                  </div>
                );
              })}
            </div>
            
            <p className="mt-4 text-sm text-paper/60 pb-2">Tap blacked-out lines to reveal context</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
