import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { SurahNode } from '../../types';
import { getBiomeEmojis, getBiomeName } from '../../utils';
import { Confetti } from '../shared/Confetti';
import { getQualityScore } from '../../sm2';

import { QuizGame } from './games/QuizGame';
import { ScrambleGame } from './games/ScrambleGame';
import { MatchGame } from './games/MatchGame';
import { VineClimb } from './games/VineClimb';
import { LanternTrail } from './games/LanternTrail';
import { OasisPuzzle } from './games/OasisPuzzle';

export interface GameComponentProps {
  mode: string;
  surah: SurahNode;
  audioEnabled: boolean;
  hapticEnabled: boolean;
  onVictory: (xpAward: number, missCount: number) => void;
}

interface GameWrapperProps {
  mode: string;
  surah: SurahNode;
  onClose: () => void;
  onComplete: (xp: number, qualityScore: number) => void;
  audioEnabled: boolean;
  hapticEnabled: boolean;
}

export const GameWrapper = ({ mode, surah, onClose, onComplete, audioEnabled, hapticEnabled }: GameWrapperProps) => {
  const [startTime] = useState(Date.now());
  const [gameState, setGameState] = useState<'playing' | 'victory'>('playing');
  const [xpToAward, setXpToAward] = useState(0);
  const [totalMisses, setTotalMisses] = useState(0);

  const handleVictory = (xpAward: number, missCount: number) => {
    setXpToAward(xpAward);
    setTotalMisses(missCount);
    setTimeout(() => setGameState('victory'), 1000);
  };

  const renderGame = () => {
    const props: GameComponentProps = {
      mode,
      surah,
      audioEnabled,
      hapticEnabled,
      onVictory: handleVictory
    };

    switch (mode) {
      case 'quiz':
      case 'tajweed':
        return <QuizGame {...props} />;
      case 'scramble':
        return <ScrambleGame {...props} />;
      case 'match':
        return <MatchGame {...props} />;
      case 'vine_climb':
        return <VineClimb {...props} />;
      case 'lantern_trail':
        return <LanternTrail {...props} />;
      case 'oasis_puzzle':
        return <OasisPuzzle {...props} />;
      default:
        // Fallback for not-yet-implemented games
        return (
          <div className="flex-1 flex items-center justify-center text-center p-6 text-paper/50">
            <p>Game mode <strong>{mode}</strong> is currently under development in Phase 4.</p>
          </div>
        );
    }
  };

  if (gameState === 'victory') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center relative z-10">
          <Confetti />
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, -10, 10, 0] }} transition={{ type: 'spring', bounce: 0.6 }} className="text-7xl mb-6 flex items-center justify-center">🏆</motion.div>
          <motion.h1 initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-300">ما شاء الله!</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-white/70 mb-10">لقد أكملت سورة {surah.arabic}</motion.p>
          
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex gap-4 w-full mb-12">
            <div className="flex-1 bg-white/5 rounded-3xl p-5 flex flex-col items-center border border-white/10">
              <span className="text-3xl mb-2 flex items-center justify-center">📝</span>
              <span className="font-bold text-lg">ممتاز</span>
              <span className="text-xs text-white/50 uppercase tracking-widest mt-1">النتيجة</span>
            </div>
            <div className="flex-1 bg-gradient-to-b from-accent/20 to-orange-500/20 rounded-3xl p-5 flex flex-col items-center border border-accent/40 shadow-[0_0_20px_rgba(217,119,6,0.3)]">
              <span className="text-3xl mb-2 flex items-center justify-center">⚡</span>
              <span className="font-black text-2xl text-accent">+{xpToAward}</span>
              <span className="text-xs text-white/50 uppercase tracking-widest mt-1">النقاط المكتسبة</span>
            </div>
          </motion.div>

          <motion.button 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            onClick={() => {
              const quality = getQualityScore(true, Date.now() - startTime, totalMisses);
              onComplete(xpToAward, quality);
            }}
            className="w-full bg-gradient-to-r from-accent to-orange-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-4 rounded-2xl shadow-lg text-lg active:scale-95 transition-transform"
          >
            متابعة الرحلة ←
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: '10%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '10%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="absolute inset-0 bg-jungle-dark/95 z-50 flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col h-full flex-1">
        <header className="flex items-center justify-between p-4 border-b border-[#2F4F2F] shrink-0">
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 active:scale-95 shadow-sm text-paper">
            <X size={20} />
          </button>
          <div className="flex-1 mx-4">
            <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-accent w-[30%]" />
            </div>
          </div>
          <span className="font-bold text-paper/70 text-sm">1/1</span>
        </header>

        <div className="flex justify-center mt-6">
          <div className="bg-black/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10 flex items-center gap-2 text-paper shadow-sm">
            <span>{getBiomeEmojis(surah.biome)[0]}</span>
            <span>{getBiomeName(surah.biome)} • سورة {surah.arabic}</span>
          </div>
        </div>

        <main className="flex-1 p-6 flex flex-col justify-center">
          {renderGame()}
        </main>
      </div>
    </motion.div>
  );
};
