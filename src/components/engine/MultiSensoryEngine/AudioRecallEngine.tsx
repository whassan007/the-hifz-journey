import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SurahNode } from '../../../types';
import { Mic, Volume2, Play, Square, Activity } from 'lucide-react';

interface AudioRecallEngineProps {
  surah: SurahNode;
  onComplete: () => void;
}

export const AudioRecallEngine: React.FC<AudioRecallEngineProps> = ({ surah, onComplete }) => {
  const [mode, setMode] = useState<'selection'|'call_response'|'degradation'|'maqam'>('selection');
  const [isPlaying, setIsPlaying] = useState(false);
  const [verseIndex, setVerseIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [degradationLevel, setDegradationLevel] = useState(0);

  const playMockAudio = (duration: number = 2000) => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setVerseIndex(v => Math.min(v + 1, surah.verses.length - 1));
      }, 3000);
    }, duration);
  };

  const renderSelection = () => (
    <div className="flex flex-col gap-4 max-w-sm mx-auto w-full">
      <button onClick={() => setMode('call_response')} className="bg-purple-900/30 hover:bg-purple-800/50 p-6 rounded-2xl border border-purple-500/30 text-right group">
        <h3 className="text-xl font-bold mb-1 group-hover:text-purple-300 transition-colors">التسميع التفاعلي (Mudarasah)</h3>
        <p className="text-sm text-paper/60">Alternate verses with a virtual reciter</p>
      </button>
      <button onClick={() => setMode('degradation')} className="bg-blue-900/30 hover:bg-blue-800/50 p-6 rounded-2xl border border-blue-500/30 text-right group">
        <h3 className="text-xl font-bold mb-1 group-hover:text-blue-300 transition-colors">تلاشي الصوت المبرمج</h3>
        <p className="text-sm text-paper/60">Audio scaffolding progressively degrades</p>
      </button>
      <button onClick={() => setMode('maqam')} className="bg-emerald-900/30 hover:bg-emerald-800/50 p-6 rounded-2xl border border-emerald-500/30 text-right group">
        <h3 className="text-xl font-bold mb-1 group-hover:text-emerald-300 transition-colors">استدعاء المقام (Maqam Recall)</h3>
        <p className="text-sm text-paper/60">Pitch contour F0 visualization</p>
      </button>
    </div>
  );

  const renderCallResponse = () => (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-2xl font-bold text-purple-400 mb-8">Call & Response Mudarasah</h3>
      
      <div className="flex items-center justify-center gap-8 md:gap-16 w-full mb-10">
        <div className={`flex flex-col items-center gap-4 transition-all duration-500 ${isPlaying ? 'opacity-100 scale-110' : 'opacity-30 scale-90'}`}>
          <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center border-4 border-blue-500/50 relative shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            {isPlaying && <span className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" />}
            <Volume2 className="text-blue-400" size={40} />
          </div>
          <span className="font-bold text-lg">المقرئ</span>
        </div>
        
        <div className="text-4xl text-paper/20">↔</div>
        
        <div className={`flex flex-col items-center gap-4 transition-all duration-500 ${isRecording ? 'opacity-100 scale-110' : 'opacity-30 scale-90'}`}>
          <div className="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center border-4 border-purple-500/50 relative shadow-[0_0_30px_rgba(168,85,247,0.2)]">
            {isRecording && <span className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" />}
            <Mic className="text-purple-400" size={40} />
          </div>
          <span className="font-bold text-lg">أنت</span>
        </div>
      </div>
      
      <div className="bg-black/20 p-8 rounded-3xl w-full max-w-lg min-h-[160px] flex items-center justify-center text-center font-arabic text-3xl leading-loose" dir="rtl">
        {isPlaying ? (
          <motion.span initial={{opacity:0}} animate={{opacity:1}} className="text-blue-200">"{surah.verses[verseIndex]}"</motion.span>
        ) : isRecording ? (
          <span className="text-purple-200 animate-pulse text-xl font-sans font-bold tracking-widest uppercase">... Listening ...</span>
        ) : (
          <span className="text-paper/40 text-xl">اضغط لبدء المدارسة</span>
        )}
      </div>
      
      <div className="mt-8 flex gap-4 h-16 items-center">
        {!isPlaying && !isRecording && (
          <button onClick={() => playMockAudio()} className="bg-white/10 p-5 rounded-full text-white hover:bg-white/20 transition-transform hover:scale-105">
            <Play fill="currentColor" size={28} />
          </button>
        )}
      </div>
    </div>
  );

  const renderDegradation = () => (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-2xl font-bold text-blue-400 mb-2">Disappearing Scaffolding</h3>
      <p className="text-paper/60 mb-8 max-w-md text-sm">Reviewing "{surah.arabicName}". The audio hints will degrade as your mastery increases.</p>
      
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between text-xs text-paper/50 mb-3 px-2 font-bold uppercase tracking-wider">
          <span>Level 0 (Full)</span>
          <span>Level 4 (Silence)</span>
        </div>
        <div className="flex gap-2 h-4">
          {[0,1,2,3,4].map(l => (
            <div key={l} className={`flex-1 rounded-full transition-colors duration-500 ${l <= degradationLevel ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>
      
      <div className="bg-black/20 p-8 rounded-3xl w-full max-w-lg mb-8 flex flex-col items-center border border-white/5 relative overflow-hidden">
         <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
         <button 
           onClick={() => setDegradationLevel(prev => (prev + 1) % 5)}
           className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold py-3 px-6 rounded-xl mb-8 transition-colors border border-blue-500/30 shadow-sm"
         >
           Toggle Degradation Stage
         </button>
         
         <div className="text-center font-arabic mt-4 text-3xl md:text-4xl leading-loose text-white" dir="rtl">
            {surah.verses[0].split(' ').map((word, i) => {
              // Word opacity logic based on degradationLevel (0-4)
              let opacityClass = "opacity-100";
              if (degradationLevel === 1) opacityClass = "opacity-70 text-blue-200";
              if (degradationLevel === 2) opacityClass = "opacity-40";
              if (degradationLevel === 3) opacityClass = i < 3 ? "opacity-30" : "opacity-0";
              if (degradationLevel === 4) opacityClass = "opacity-0 hidden";
              
              if (degradationLevel === 4) return null;

              return (
                 <span key={i} className={`transition-all duration-700 px-1 ${opacityClass}`}>{word}</span>
              );
            })}
            {degradationLevel === 4 && <span className="opacity-100 text-paper/50 text-xl font-sans tracking-widest uppercase">Recite from memory (Silence)</span>}
         </div>
      </div>
    </div>
  );

  const renderMaqam = () => (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-2xl font-bold text-emerald-400 mb-2">Maqam-Anchored Recall</h3>
      <p className="text-paper/60 mb-8 max-w-md text-sm">Listen to the melodic contour (F0) without words to trigger recall.</p>
      
      <div className="w-full max-w-lg bg-black/40 rounded-3xl p-8 border border-white/10 flex flex-col items-center shadow-inner">
        <div className="w-full h-40 relative flex items-center justify-center overflow-hidden mb-8 rounded-xl bg-black/50 border border-white/5">
          <Activity className="text-emerald-500/20 absolute w-full h-full p-4" strokeWidth={0.5} />
          {isPlaying ? (
            <svg viewBox="0 0 100 20" className="w-full h-full stroke-emerald-400 stroke-[1.5] fill-none drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]">
              <path d="M-10 10 Q 10 -5, 20 10 T 40 10 T 60 0 T 80 18 T 110 10">
                <animate attributeName="d" values="M-10 10 Q 10 -5, 20 10 T 40 10 T 60 0 T 80 18 T 110 10; M-10 10 Q 10 25, 20 10 T 40 10 T 60 20 T 80 -2 T 110 10; M-10 10 Q 10 -5, 20 10 T 40 10 T 60 0 T 80 18 T 110 10" dur="2.5s" repeatCount="indefinite" />
              </path>
            </svg>
          ) : (
            <svg viewBox="0 0 100 20" className="w-full h-full stroke-emerald-400/20 stroke-1 fill-none">
              <path d="M-10 10 Q 10 0, 20 10 T 40 10 T 60 5 T 80 15 T 110 10" />
            </svg>
          )}
        </div>
        
        <button 
          onClick={() => { setIsPlaying(!isPlaying); }} 
          className="bg-gradient-to-tr from-emerald-600 to-emerald-400 text-black rounded-full p-6 mb-4 hover:scale-110 active:scale-95 transition-transform shadow-[0_0_30px_rgba(52,211,153,0.4)]"
        >
          {isPlaying ? <Square fill="currentColor" size={28} /> : <Play fill="currentColor" size={28} className="ml-1" />}
        </button>
        <span className="font-bold text-emerald-400 tracking-wider mb-8">Makam Hijaz Contour</span>
        
        <div className="text-center font-arabic text-xl md:text-2xl leading-loose text-emerald-100/50" dir="rtl">
          {surah.verses[0]}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 text-center bg-black/40 rounded-3xl backdrop-blur-md border border-white/10 w-full relative overflow-hidden">
      {mode !== 'selection' && (
        <button onClick={() => setMode('selection')} className="absolute top-6 left-6 text-sm bg-white/10 px-5 py-2.5 rounded-xl hover:bg-white/20 font-bold z-10 transition-colors">
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/20">
                <Mic className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-black mb-3">الذاكرة السمعية</h2>
              <p className="text-paper/80 mb-10 max-w-md mx-auto text-sm md:text-base leading-relaxed">
                Interactive auditory training using AI validation, degradation scaffolding, and pitch tracking.
              </p>
              {renderSelection()}
            </div>
          )}

          {mode === 'call_response' && renderCallResponse()}
          {mode === 'degradation' && renderDegradation()}
          {mode === 'maqam' && renderMaqam()}
        </motion.div>
      </AnimatePresence>

      <div className="shrink-0 mt-8">
        <button onClick={onComplete} className="bg-white/5 text-paper/70 px-8 py-3 rounded-xl hover:bg-white/10 hover:text-white transition-colors">
          إنهاء التدريب السمعي
        </button>
      </div>
    </div>
  );
};
