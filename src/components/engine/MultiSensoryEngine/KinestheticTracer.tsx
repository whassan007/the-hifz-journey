import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SurahNode } from '../../../types';
import { Hand, MousePointer2, Activity } from 'lucide-react';

interface KinestheticTracerProps {
  surah: SurahNode;
  onComplete: () => void;
}

export const KinestheticTracer: React.FC<KinestheticTracerProps> = ({ surah, onComplete }) => {
  const [mode, setMode] = useState<'selection'|'tracing'|'tapping'>('selection');
  const [verseIndex, setVerseIndex] = useState(0);
  const [tracedWords, setTracedWords] = useState<number[]>([]);
  const [tapScore, setTapScore] = useState(0);
  const [isTappingActive, setIsTappingActive] = useState(false);

  // Tracing Logic
  const currentWords = surah.verses[verseIndex].split(' ');
  const allWordsTraced = currentWords.length > 0 && tracedWords.length >= currentWords.length;

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return; // only track while pressed
    const elem = document.elementFromPoint(e.clientX, e.clientY);
    if (elem) {
      const idxStr = elem.getAttribute('data-word-idx');
      if (idxStr !== null) {
        const idx = parseInt(idxStr, 10);
        if (!tracedWords.includes(idx)) {
          setTracedWords(prev => [...prev, idx]);
        }
      }
    }
  };

  useEffect(() => {
    if (allWordsTraced) {
      const timer = setTimeout(() => {
        setTracedWords([]);
        setVerseIndex(v => Math.min(v + 1, surah.verses.length - 1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [allWordsTraced, surah.verses.length]);

  // Tapping Logic
  const handleTap = () => {
    if (!isTappingActive) return;
    setTapScore(s => s + 1);
    // In real app, we check if tap aligns with syllable onset timestamp
  };

  const renderSelection = () => (
    <div className="flex flex-col gap-4 max-w-sm mx-auto w-full">
      <button onClick={() => { setMode('tracing'); setTracedWords([]); }} className="bg-orange-900/30 hover:bg-orange-800/50 p-6 rounded-2xl border border-orange-500/30 text-right group">
        {/* eslint-disable-next-line local/no-hardcoded-arabic */}
        <h3 className="text-xl font-bold mb-1 group-hover:text-orange-300 transition-colors">نمط التتبع (Tracing Mode)</h3>
        <p className="text-sm text-paper/60">Trace Arabic words with your finger</p>
      </button>
      <button onClick={() => { setMode('tapping'); setTapScore(0); }} className="bg-rose-900/30 hover:bg-rose-800/50 p-6 rounded-2xl border border-rose-500/30 text-right group">
        {/* eslint-disable-next-line local/no-hardcoded-arabic */}
        <h3 className="text-xl font-bold mb-1 group-hover:text-rose-300 transition-colors">النقر الإيقاعي (Rhythmic Tapping)</h3>
        <p className="text-sm text-paper/60">Tap along with the syllables</p>
      </button>
    </div>
  );

  const renderTracing = () => (
    <div className="flex flex-col items-center w-full relative touch-none pointer-events-auto" onPointerMove={handlePointerMove} onPointerDown={handlePointerMove}>
      <h3 className="text-2xl font-bold text-orange-400 mb-2">Finger Tracing</h3>
      <p className="text-paper/60 mb-8 max-w-md text-sm">Drag your finger over the faded words to trace them. Motor memory encodes the verse physically.</p>
      
      <div className="bg-black/20 p-8 rounded-3xl w-full max-w-2xl min-h-[250px] flex items-center justify-center border border-white/5 relative">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,theme(colors.orange.500),transparent)]" />
        
        <div className="flex flex-wrap gap-4 justify-center leading-[3] font-arabic text-4xl md:text-5xl select-none" dir="rtl">
          {currentWords.map((word, i) => (
            <span 
              key={i} 
              data-word-idx={i}
              className={`transition-all duration-300 px-1 py-4 rounded-lg select-none cursor-crosshair font-arabic
                ${tracedWords.includes(i) 
                  ? 'text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.8)] opacity-100' 
                  : 'text-transparent opacity-40 hover:opacity-70'
                }`}
              style={{ paddingBottom: '1rem', textShadow: tracedWords.includes(i) ? 'none' : '0 0 1px rgba(255,255,255,0.8), 0 0 2px rgba(255,255,255,0.4)' }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mt-8 text-paper/50 flex items-center gap-2">
         {allWordsTraced ? (
           <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-400 font-bold flex items-center gap-2">
             {/* eslint-disable-next-line local/no-hardcoded-arabic */}
             ✓ تم التتبع بنجاح
           </motion.span>
         ) : (
           <>
             {/* eslint-disable-next-line local/no-hardcoded-arabic */}
             <span className="flex items-center gap-2"><MousePointer2 size={16} /> المس واسحب فوق الكلمات</span>
           </>
         )}
      </div>
    </div>
  );

  const renderTapping = () => (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-2xl font-bold text-rose-400 mb-2">Rhythmic Tapping</h3>
      <p className="text-paper/60 mb-8 max-w-md text-sm">Tap the target to the rhythm of the Reciter's syllables.</p>
      
      <div className="bg-black/20 p-8 rounded-3xl w-full max-w-lg min-h-[300px] flex flex-col items-center justify-center border border-white/5 relative">
         <div className="font-arabic text-2xl md:text-3xl leading-loose text-white mb-12 text-center transition-opacity" dir="rtl">
           {surah.verses[0]}
         </div>
         
         <button 
           onPointerDown={() => {
             if (!isTappingActive) setIsTappingActive(true);
             handleTap();
           }}
           className="w-32 h-32 rounded-full border-4 relative overflow-hidden flex items-center justify-center transition-transform active:scale-90 bg-rose-500/20 border-rose-500/50 group"
         >
           <div className={`absolute inset-0 bg-rose-500/50 transition-opacity ${isTappingActive ? 'opacity-100' : 'opacity-0'} group-active:opacity-100 rounded-full`} />
           <Activity className={`z-10 text-rose-300 ${isTappingActive ? 'animate-pulse' : ''}`} size={48} />
         </button>
         
         <div className="mt-8 text-xl font-black text-rose-400">
           Score: {tapScore * 10}
         </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 text-center bg-black/40 rounded-3xl backdrop-blur-md border border-white/10 w-full relative overflow-hidden">
      {mode !== 'selection' && (
        <button onClick={() => setMode('selection')} className="absolute top-6 left-6 text-sm bg-white/10 px-5 py-2.5 rounded-xl hover:bg-white/20 font-bold z-10 transition-colors">
          {/* eslint-disable-next-line local/no-hardcoded-arabic */}
          ← عودة
        </button>
      )}

      <AnimatePresence mode="wait">
        <motion.div 
          key={mode} 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -10 }} 
          className="w-full flex-1 flex flex-col items-center justify-center"
        >
          {mode === 'selection' && (
            <div className="w-full">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20">
                <Hand className="text-white" size={32} />
              </div>
              {/* eslint-disable-next-line local/no-hardcoded-arabic */}
              <h2 className="text-3xl font-black mb-3">الذاكرة الحركية</h2>
              <p className="text-paper/80 mb-10 max-w-md mx-auto text-sm md:text-base leading-relaxed">
                Kinesthetic encoding through hand tracing, swipe gestures, and rhythmic syllable tapping.
              </p>
              {renderSelection()}
            </div>
          )}

          {mode === 'tracing' && renderTracing()}
          {mode === 'tapping' && renderTapping()}
        </motion.div>
      </AnimatePresence>

      <div className="shrink-0 mt-8">
        <button onClick={onComplete} className="bg-white/5 text-paper/70 px-8 py-3 rounded-xl hover:bg-white/10 hover:text-white transition-colors">
          {/* eslint-disable-next-line local/no-hardcoded-arabic */}
          إنهاء التدريب الحركي
        </button>
      </div>
    </div>
  );
};
