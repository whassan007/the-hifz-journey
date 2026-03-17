import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { SurahNode } from '../../../types';
import { Volume2, Mic, Eye, MoveRight, CheckCircle2 } from 'lucide-react';
import { ProgressiveMasking } from './ProgressiveMasking';

interface DeepMemorizationFlowProps {
  surah: SurahNode;
  onComplete: (score: number) => void;
}

export const DeepMemorizationFlow: React.FC<DeepMemorizationFlowProps> = ({ surah, onComplete }) => {
  const [phase, setPhase] = useState<1|2|3|4|5|6>(1);
  const [verseIndex, setVerseIndex] = useState(0);
  
  // Phase 1: Listen
  const [audioPlaying, setAudioPlaying] = useState(false);
  
  // Phase 2: Trace
  const [tracedWords, setTracedWords] = useState<number[]>([]);
  
  // Phase 3, 5, 6: Mic Validation
  const [micActive, setMicActive] = useState(false);
  const [validationFallbackAvailable, setValidationFallbackAvailable] = useState(false);
  const [manualValidationSuccess, setManualValidationSuccess] = useState(false);

  // Phase 4: Masking Step
  const [maskStep, setMaskStep] = useState(0); // 0, 1, 2, 3

  useEffect(() => {
    // Reset state on phase or verse change
    setAudioPlaying(false);
    setTracedWords([]);
    setMicActive(false);
    setValidationFallbackAvailable(false);
    setManualValidationSuccess(false);
    setMaskStep(0);

    let timer: ReturnType<typeof setTimeout>;

    if (phase === 1) {
      setAudioPlaying(true);
      timer = setTimeout(() => {
        setAudioPlaying(false);
      }, 3000); // Simulate audio playback
    } else if (phase === 3 || phase === 5 || phase === 6) {
      setMicActive(true);
      timer = setTimeout(() => {
        setValidationFallbackAvailable(true);
      }, 5000); // 5 seconds until manual fallback appears
    }

    return () => clearTimeout(timer);
  }, [phase, verseIndex]);

  const currentWords = surah.verses[verseIndex]?.split(' ') || [];
  const allWordsTraced = currentWords.length > 0 && tracedWords.length >= currentWords.length;

  let isNextEnabled = false;
  if (phase === 1) isNextEnabled = !audioPlaying;
  else if (phase === 2) isNextEnabled = allWordsTraced;
  else if (phase === 3) isNextEnabled = manualValidationSuccess;
  else if (phase === 4) isNextEnabled = maskStep >= 3;
  else if (phase === 5) isNextEnabled = manualValidationSuccess;
  else if (phase === 6) isNextEnabled = manualValidationSuccess;

  const handleNextPhase = () => {
    if (!isNextEnabled) return;
    
    if (phase < 6) {
      setPhase((p) => (p + 1) as 1|2|3|4|5|6);
    } else {
      if (verseIndex < surah.verses.length - 1) {
        setPhase(1);
        setVerseIndex(i => i + 1);
      } else {
        onComplete(100);
      }
    }
  };

  const skipToNextVerse = () => {
    if (verseIndex < surah.verses.length - 1) {
      setPhase(1);
      setVerseIndex(i => i + 1);
    } else {
      onComplete(100);
    }
  };

  const renderPhaseDetails = () => {
    switch(phase) {
      case 1: return <div className="text-xl text-accent flex items-center gap-2"><Volume2 className={audioPlaying ? 'animate-pulse' : ''} /> {audioPlaying ? 'جاري التشغيل...' : 'استمع بانتباه (Listen in full)'}</div>;
      case 2: return <div className="text-xl text-accent flex items-center gap-2"><Eye /> تتبع الكلمات (Trace words: {tracedWords.length}/{currentWords.length})</div>;
      case 3: return <div className="text-xl text-accent flex items-center gap-2"><Mic className={micActive ? 'animate-pulse text-rose-400' : ''} /> اقرأ مع النص (Echo with text)</div>;
      case 4: return <div className="text-xl text-accent flex items-center gap-2"><Eye className="opacity-50" /> الإخفاء التدريجي (Mask and recall: {maskStep}/3)</div>;
      case 5: return <div className="text-xl text-accent flex items-center gap-2"><Mic className={micActive ? 'animate-pulse text-rose-400' : ''} /> اقرأ من الذاكرة (Pure recall)</div>;
      case 6: return <div className="text-xl text-accent flex items-center gap-2"><MoveRight /> اربط الآية بما قبلها (Context anchoring)</div>;
    }
  };



  const renderManualSuccess = () => {
    if (!manualValidationSuccess) return null;
    return (
       <motion.div initial={{scale:0}} animate={{scale:1}} className="mt-6 flex flex-col items-center justify-center gap-2 text-emerald-400">
         <div className="flex items-center gap-2"><CheckCircle2 /> <span className="font-bold">تم التوثيق (Validated)</span></div>
       </motion.div>
    );
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      {/* ProgressBar for the 6 phases within the current verse */}
      <div className="w-full max-w-2xl flex gap-1 mb-4 h-2 rounded-full overflow-hidden bg-white/5">
        {[1,2,3,4,5,6].map(p => (
           <div key={p} className={`flex-1 transition-colors duration-500 ${p < phase ? 'bg-accent' : p === phase ? 'bg-accent/60 animate-pulse' : 'bg-transparent'}`} />
        ))}
      </div>

      <div className="w-full max-w-2xl bg-black/40 rounded-3xl p-8 backdrop-blur-md border border-white/10 text-center relative">
        <h2 className="text-2xl font-bold mb-4">الحفظ العميق (المرحلة {phase}/6)</h2>
        <div className="text-paper/60 mb-2">Verse {verseIndex + 1} of {surah.verses.length}</div>
        
        <div className="flex justify-center mb-8">
          {renderPhaseDetails()}
        </div>
        
        <div className="bg-white/5 p-8 rounded-2xl w-full min-h-[250px] flex flex-col items-center justify-center relative overflow-hidden mb-8 border border-white/5">
           <motion.div 
             key={`verse-${verseIndex}`} 
             initial={{opacity:0, scale:0.95}} 
             animate={{opacity:1, scale:1}} 
             className="text-3xl md:text-4xl font-arabic leading-loose w-full flex flex-col items-center" 
             dir="rtl"
           >
                {phase === 4 ? (
                  <div className="flex flex-col items-center">
                    <ProgressiveMasking text={surah.verses[verseIndex]} stage={1} fadeLevel={maskStep * 33.3} />
                    {maskStep < 3 && (
                      <button 
                        onClick={() => setMaskStep(m => m + 1)}
                        className="mt-8 bg-white/10 px-6 py-2 rounded-lg text-sm hover:bg-white/20"
                      >
                        إخفاء المزيد وتسميع (Mask more & recite)
                      </button>
                    )}
                  </div>
                ) : phase === 5 ? (
                  <div className="flex flex-col items-center justify-center h-full py-12 w-full">
                     <div className="w-24 h-24 rounded-full bg-rose-500/10 flex items-center justify-center mb-6">
                       <Mic className="text-rose-500 animate-pulse" size={48} />
                     </div>
                     <span className="text-paper/60 text-2xl font-bold mb-8">اقرأ الآية من الذاكرة</span>
                     
                     {!manualValidationSuccess ? (
                       <button 
                         onClick={() => setManualValidationSuccess(true)}
                         className="bg-accent/20 text-accent border border-accent/30 px-8 py-3 rounded-xl hover:bg-accent/30 transition-colors text-lg"
                       >
                         أنهيت التلاوة (Done Reciting)
                       </button>
                     ) : (
                       renderManualSuccess()
                     )}
                     
                     {/* Phase 5 fail loop mock */}
                     {validationFallbackAvailable && !manualValidationSuccess && (
                        <button onClick={() => setPhase(3)} className="mt-8 text-paper/40 hover:text-white text-sm underline">
                          أخطأت؟ العودة للنص (Failed? Return to Phase 3)
                        </button>
                     )}
                  </div>
                ) : phase === 6 ? (
                  <div className="flex flex-col gap-6 items-center py-8 w-full">
                    {verseIndex > 0 ? (
                      <motion.div initial={{opacity:0, y:-10}} animate={{opacity:0.5, y:0}} className="text-paper/60 text-2xl border-b border-white/5 pb-6 text-center w-full">
                        {surah.verses[verseIndex - 1]}
                      </motion.div>
                    ) : (
                      <div className="text-paper/50 text-lg border-b border-white/5 pb-4">(هذه أول آية - This is the first verse)</div>
                    )}
                    
                    <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="text-paper/30 w-full min-h-[100px] flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl relative p-4">
                       {!manualValidationSuccess ? (
                         <div className="flex flex-col items-center gap-4 py-2">
                           <Mic className="text-rose-500 animate-pulse" size={32} />
                           <span className="text-lg">اقرأ الآية الحالية لربطها (Recite current verse to link)</span>
                           <button 
                             onClick={() => setManualValidationSuccess(true)}
                             className="bg-accent/20 text-accent border border-accent/30 px-6 py-2 rounded-xl text-sm font-sans hover:bg-accent/30 mt-2"
                           >
                             أتممت الربط (Done Linking)
                           </button>
                         </div>
                       ) : (
                         <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-accent text-3xl py-4 font-bold w-full text-center">
                           {surah.verses[verseIndex]}
                         </motion.div>
                       )}
                    </motion.div>
                    
                    {renderManualSuccess()}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 justify-center touch-manipulation">
                    {currentWords.map((word, wIdx) => {
                      const isTraced = tracedWords.includes(wIdx);
                      return (
                        <motion.span
                          key={`${verseIndex}-${wIdx}`}
                          initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          transition={{ delay: phase === 1 ? wIdx * 0.15 : 0, duration: 0.5 }}
                          onPointerDown={() => {
                             if (phase === 2 && !tracedWords.includes(wIdx)) {
                               setTracedWords(prev => [...prev, wIdx]);
                             }
                          }}
                          onPointerOver={(e) => {
                             if (phase === 2 && e.buttons === 1 && !tracedWords.includes(wIdx)) {
                               setTracedWords(prev => [...prev, wIdx]);
                             }
                          }}
                          className={`inline-block ${phase === 1 ? 'text-paper' : phase === 2 ? (isTraced ? 'text-accent' : 'text-paper/30 hover:scale-110 transition-transform cursor-pointer') : 'text-white'}`}
                        >
                          {word}
                        </motion.span>
                      );
                    })}
                  </div>
                )}
                
                {phase === 3 && (
                   <div className="flex flex-col items-center mt-8 w-full border-t border-white/10 pt-8">
                     {!manualValidationSuccess && (
                       <div className="flex flex-col items-center gap-3">
                         <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mb-2">
                           <Mic className="text-rose-400 animate-pulse" size={32} />
                         </div>
                         <div className="text-rose-400 text-sm font-sans animate-pulse">جاري الاستماع... (Listening...)</div>
                         <button 
                           onClick={() => setManualValidationSuccess(true)}
                           className="bg-accent/20 text-accent border border-accent/30 px-8 py-3 rounded-xl hover:bg-accent/30 transition-colors font-sans mt-2"
                         >
                           أنهيت التلاوة (Done Reciting)
                         </button>
                       </div>
                     )}
                     {renderManualSuccess()}
                   </div>
                )}
              </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={handleNextPhase}
            disabled={!isNextEnabled}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all flex-1 ${isNextEnabled ? 'bg-accent text-jungle-dark hover:bg-white shadow-lg shadow-accent/20' : 'bg-white/5 text-paper/30 cursor-not-allowed border border-white/5'}`}
          >
            {/* eslint-disable-next-line local/no-hardcoded-arabic */}
            {phase < 6 ? 'المرحلة التالية (Next Phase)' : (verseIndex < surah.verses.length - 1 ? 'الآية التالية (Next Verse)' : 'إنهاء التدريب (Finish)')}
          </button>
          
          {phase < 6 && verseIndex < surah.verses.length - 1 && (
            <button 
              onClick={skipToNextVerse}
              className="bg-white/5 text-paper/50 px-6 py-4 rounded-xl font-bold hover:bg-white/10 hover:text-white transition-colors flex shrink-0 items-center justify-center border border-transparent"
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

