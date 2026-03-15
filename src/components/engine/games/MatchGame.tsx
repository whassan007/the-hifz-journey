import { useState, useEffect } from 'react';
import type { GameComponentProps } from '../GameWrapper';

// Define the shape of our pair data
interface Pair {
  id: string;
  arabic: string;
  english: string;
}
const MOCK_QUESTIONS = new Proxy({}, { get: () => ({ words: ['Test'], translation: 'Test', cues: ['Test'], options: ['A','B'] }) });
import { audioEngine, triggerHaptic } from '../../../audio';

export const MatchGame = ({ mode, audioEnabled, hapticEnabled, onVictory }: GameComponentProps) => {
  const [selectedArabic, setSelectedArabic] = useState<string | null>(null);
  const [selectedEnglish, setSelectedEnglish] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [isWrong, setIsWrong] = useState(false);
  const [missCount, setMissCount] = useState(0);

  const currentData = MOCK_QUESTIONS[mode as keyof typeof MOCK_QUESTIONS] as { pairs: Pair[] };

  const handleMatchSelect = (type: 'arabic' | 'english', id: string) => {
    triggerHaptic(hapticEnabled, 'light');
    if (type === 'arabic') setSelectedArabic(id);
    else setSelectedEnglish(id);
  };

  useEffect(() => {
    if (selectedArabic && selectedEnglish) {
      const pair = currentData.pairs.find((p) => p.id === selectedArabic);
      if (pair && pair.id === selectedEnglish) {
        // Defer state update to next tick to avoid cascading render cycle
        const timer = setTimeout(() => {
          audioEngine.playChime(audioEnabled);
          setMatchedPairs(prev => [...prev, selectedArabic]);
          setSelectedArabic(null);
          setSelectedEnglish(null);
          if (matchedPairs.length + 1 === currentData.pairs.length) {
            triggerHaptic(hapticEnabled, 'success');
            onVictory(40, missCount);
          }
        }, 0);
        return () => clearTimeout(timer);
      } else {
        // Defer missed state update to next tick
        const errTimer = setTimeout(() => {
          audioEngine.playThud(audioEnabled);
          triggerHaptic(hapticEnabled, 'error');
          setMissCount(p => p + 1);
          setIsWrong(true);
        }, 0);
        
        const resetTimer = setTimeout(() => {
          setIsWrong(false);
          setSelectedArabic(null);
          setSelectedEnglish(null);
        }, 600);
        
        return () => {
          clearTimeout(errTimer);
          clearTimeout(resetTimer);
        };
      }
    }
  }, [selectedArabic, selectedEnglish, currentData.pairs, matchedPairs.length, audioEnabled, hapticEnabled, missCount, onVictory]);

  return (
    <div className="flex flex-col flex-1">
      <p className="text-center text-paper/50 text-xs font-bold uppercase tracking-widest mb-8">طابق الكلمات بمعانيها</p>
      
      <div className="grid grid-cols-2 gap-6 flex-1 items-center">
        <div className="flex flex-col gap-4">
          {currentData.pairs.map((p) => {
            const isMatched = matchedPairs.includes(p.id);
            const isSelected = selectedArabic === p.id;
            
            let btnClass = "bg-black/20 border-white/5 text-paper";
            if (isSelected) btnClass = isWrong && selectedEnglish ? "bg-[#B35E4C] border-[#D98977] animate-shake" : "bg-accent/20 border-accent text-accent shadow-[0_0_15px_rgba(193,154,107,0.3)]";
            if (isMatched) btnClass = "bg-[#3C5B3E]/40 border-[#A4C3A2] text-[#A4C3A2] opacity-40 scale-95";

            return (
              <button 
                key={p.id} disabled={isMatched} onClick={() => handleMatchSelect('arabic', p.id)}
                className={`p-5 rounded-2xl border-2 font-arabic text-3xl transition-all h-24 flex items-center justify-center active:scale-95 shadow-sm backdrop-blur-sm ${btnClass}`}
              >
                {p.arabic}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-4">
          {/* Note: In a real app we'd shuffle these, but for now we rely on the original logic */}
          {[...currentData.pairs].sort((a,b)=>a.english.localeCompare(b.english)).map((p) => {
            const isMatched = matchedPairs.includes(p.id);
            const isSelected = selectedEnglish === p.id;
            
            let btnClass = "bg-black/20 border-white/5 text-paper";
            if (isSelected) btnClass = isWrong && selectedArabic ? "bg-[#B35E4C] border-[#D98977] animate-shake" : "bg-accent/20 border-accent text-accent shadow-[0_0_15px_rgba(193,154,107,0.3)]";
            if (isMatched) btnClass = "bg-[#3C5B3E]/40 border-[#A4C3A2] text-[#A4C3A2] opacity-40 scale-95";

            return (
              <button 
                key={p.id} disabled={isMatched} onClick={() => handleMatchSelect('english', p.id)}
                className={`p-5 rounded-2xl border-2 font-bold text-sm transition-all h-24 flex items-center justify-center text-center active:scale-95 shadow-sm backdrop-blur-sm ${btnClass}`}
              >
                {p.english}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
