import UI from '../../../data/ui-text.json';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { GameComponentProps } from '../GameWrapper';
const MOCK_QUESTIONS = new Proxy({}, { get: () => ({ words: ['Test'], translation: 'Test', cues: ['Test'], options: ['A','B'] }) });
import { audioEngine, triggerHaptic } from '../../../audio';
import { Lightbulb, Send } from 'lucide-react';

export const LanternTrail = ({ mode, audioEnabled, hapticEnabled, onVictory }: GameComponentProps) => {
  const [inputText, setInputText] = useState('');
  const [isWrong, setIsWrong] = useState(false);
  const [missCount, setMissCount] = useState(0);

  const currentData = MOCK_QUESTIONS[mode as keyof typeof MOCK_QUESTIONS] as { words: string[], translation: string, cues: string[] };
  const targetWords = currentData.words;
  
  // Clean Arabic text for loose matching (strip diacritics in a real app)
  const cleanArabic = (text: string) => text.replace(/[\u064B-\u065F]/g, '').trim();

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Compare input vs translation equivalent
    const inputCleaned = cleanArabic(inputText);
    const targetCleaned = cleanArabic(currentData.translation);

    triggerHaptic(hapticEnabled, 'light');

    if (inputCleaned === targetCleaned) {
      audioEngine.playChime(audioEnabled);
      triggerHaptic(hapticEnabled, 'success');
      onVictory(75, missCount);
    } else {
      audioEngine.playThud(audioEnabled);
      triggerHaptic(hapticEnabled, 'error');
      setMissCount(p => p + 1);
      setIsWrong(true);
      setTimeout(() => setIsWrong(false), 800);
    }
  };

  // Auto-complete checking (as they type)
  useEffect(() => {
    if (cleanArabic(inputText) === cleanArabic(currentData.translation)) {
      // Use a timeout to push the state update out of the render cycle
      const timer = setTimeout(() => {
        audioEngine.playChime(audioEnabled);
        triggerHaptic(hapticEnabled, 'success');
        onVictory(75, missCount);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [inputText, currentData.translation, audioEnabled, hapticEnabled, missCount, onVictory]);

  return (
    <div className="flex flex-col flex-1 h-full pt-8">
      <div className="flex flex-col items-center mb-12">
        <p className="text-[#FFC107] text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
          <Lightbulb size={16} /> الدلائل المضيئة
        </p>
        <p className="text-paper/70 text-sm text-center max-w-sm">
          أكمل الآية بناءً على الحروف الأولى من كل كلمة. سيختبر هذا قدرتك على تذكر السورة من أقل الدلائل.
        </p>
      </div>

      {/* Floating Lanterns */}
      <div className="flex flex-wrap gap-4 justify-center items-center mb-16">
        {currentData.cues.map((cue: string, i: number) => {
          // Check if user has correctly typed this word so far
          const inputWords = cleanArabic(inputText).split(' ');
          const targetCleanWord = cleanArabic(targetWords[i]);
          const isWordCorrectlyTyped = inputWords[i] === targetCleanWord;

          return (
            <motion.div 
              key={i}
              initial={{ y: 0 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, delay: i * 0.2 }}
              className={`relative flex items-center justify-center w-20 h-28 rounded-full border-2 transition-all duration-700 ${isWordCorrectlyTyped ? 'bg-[#FFC107]/20 border-[#FFC107] shadow-[0_0_30px_rgba(255,193,7,0.6)]' : 'bg-black/40 border-white/10 shadow-lg'}`}
            >
              {/* The light glow inside the lantern */}
              <div className={`absolute top-4 w-6 h-6 rounded-full blur-md transition-all duration-1000 ${isWordCorrectlyTyped ? 'bg-[#FFC107] opacity-80' : 'bg-orange-500 opacity-20'}`} />
              
              <span className={`text-3xl font-arabic font-bold z-10 transition-colors ${isWordCorrectlyTyped ? 'text-[#FFC107]' : 'text-white/50'}`}>
                {isWordCorrectlyTyped ? targetWords[i] : cue}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-auto max-w-md w-full mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            dir="rtl"
            placeholder={UI.ui_6}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className={`w-full bg-black/40 border-2 rounded-2xl py-4 px-6 text-2xl font-arabic text-paper outline-none transition-colors backdrop-blur-md shadow-inner ${isWrong ? 'border-red-500 focus:border-red-500 animate-shake' : 'border-white/10 focus:border-[#FFC107]'}`}
          />
          <button 
            type="submit"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#FFC107] text-jungle-dark rounded-xl flex items-center justify-center hover:bg-yellow-400 active:scale-95 transition-transform"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
