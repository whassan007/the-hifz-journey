import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import type { GameComponentProps } from '../GameWrapper';
import { MOCK_QUESTIONS } from '../../../data/mockQuestions';
import { audioEngine, triggerHaptic } from '../../../audio';

export const QuizGame = ({ mode, audioEnabled, hapticEnabled, onVictory }: GameComponentProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [missCount, setMissCount] = useState(0);

  const currentData = MOCK_QUESTIONS[mode as keyof typeof MOCK_QUESTIONS] as { ayah: string, translation: string, options: string[], answer: string, hint: string, question?: string };

  const handleQuizAnswer = (opt: string) => {
    if (selectedOption) return;
    setSelectedOption(opt);
    triggerHaptic(hapticEnabled, 'light');
    
    if (opt === currentData.answer) {
      audioEngine.playChime(audioEnabled);
      triggerHaptic(hapticEnabled, 'success');
      onVictory(20, missCount);
    } else {
      audioEngine.playThud(audioEnabled);
      triggerHaptic(hapticEnabled, 'error');
      setMissCount(p => p + 1);
      setIsWrong(true);
      setTimeout(() => {
        setIsWrong(false);
        setShowHint(true);
      }, 600);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex flex-col items-center justify-center flex-1 bg-gradient-to-b from-black/20 to-transparent rounded-3xl border border-white/5 p-6 mb-8 text-center relative overflow-hidden shadow-inner">
        <div className={`absolute inset-0 border-2 rounded-3xl transition-opacity ${isWrong ? 'border-red-500 opacity-100' : 'opacity-0'}`} />
        <div className="w-full flex justify-end mb-2 z-10">
          <button className="text-paper/40 hover:text-accent transition-colors active:scale-95 bg-black/20 p-2 rounded-full border border-white/5">
            <Volume2 size={20} />
          </button>
        </div>
        {mode === 'tajweed' && <p className="text-xs font-bold text-accent uppercase tracking-widest mb-4">Tajweed Rule</p>}
        <p className="font-arabic text-4xl leading-loose mb-4 z-10 text-paper">{currentData.ayah}</p>
        {mode === 'tajweed' ? (
          <p className="text-lg font-bold text-paper/90 z-10">{currentData.question}</p>
        ) : (
          <p className="text-sm text-paper/60 italic z-10">{currentData.translation}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {currentData.options.map((opt: string) => {
          const isSelected = selectedOption === opt;
          const isCorrect = opt === currentData.answer;
          
          let btnClass = "bg-black/20 border-white/10 hover:bg-black/40 text-paper";
          let animClass = "";
          
          if (isSelected) {
            if (isCorrect) {
              btnClass = "bg-[#3C5B3E] border-[#A4C3A2] text-paper";
              animClass = "animate-bounce-in";
            } else {
              btnClass = "bg-[#B35E4C] border-[#D98977] text-paper";
              animClass = "animate-shake";
            }
          } else if (showHint && isCorrect) {
            btnClass = "bg-[#3C5B3E] border-[#A4C3A2] text-paper";
            animClass = "animate-pulse-glow";
          }

          return (
            <button 
              key={opt}
              disabled={!!selectedOption || showHint}
              onClick={() => handleQuizAnswer(opt)}
              className={`p-5 rounded-2xl border-2 text-xl font-arabic transition-all flex items-center justify-center active:scale-95 shadow-sm backdrop-blur-sm ${btnClass} ${animClass}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="mt-6 bg-[#8B5A2B]/10 border border-accent rounded-2xl p-5 relative overflow-hidden shadow-lg shadow-accent/10 cursor-pointer backdrop-blur-md"
            onClick={() => { setShowHint(false); setSelectedOption(null); }}
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-accent" />
            <h4 className="font-bold text-accent mb-2 flex items-center gap-2 text-lg"><span>💡</span> تلميح التفسير</h4>
            <p className="text-sm text-paper/80 leading-relaxed mb-4">{currentData.hint}</p>
            <button className="w-full py-3 bg-accent hover:bg-[#A48259] text-paper font-bold rounded-xl text-sm transition-colors active:scale-95 pointer-events-none shadow-sm">
              Got it — took effort
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
