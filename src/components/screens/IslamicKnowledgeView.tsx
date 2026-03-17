import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LockIcon, X, Play, Star } from 'lucide-react';
import type { UserState, ImamNode } from '../../types';
import { IMAMS } from '../../data/imams';

interface IslamicKnowledgeViewProps {
  user: UserState;
  setActiveGame: (game: string) => void;
}

export const IslamicKnowledgeView = ({ user, setActiveGame }: IslamicKnowledgeViewProps) => {
  const [selectedNode, setSelectedNode] = useState<{ imam: ImamNode, isUnlocked: boolean, isCompleted: boolean } | null>(null);

  const unlockedIds = user.unlockedImamIds || [1];
  const completedIds = user.completedImamIds || [];

  return (
    <div className="flex flex-col items-center py-4 relative pb-12 w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="w-full px-6 mb-8 mt-4 text-center">
        <h1 className="text-4xl font-arabic text-amber-400 mb-2 drop-shadow-md">مسار النور</h1>
        <p className="text-emerald-100/80 text-sm">The Twelve Imams</p>

        {completedIds.length === 12 && (
          <div className="mt-4 inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/50 text-amber-300 px-4 py-2 rounded-full text-sm">
            <Star size={16} className="fill-amber-400" /> سلسله النور Completed!
          </div>
        )}
      </div>

      {IMAMS.map((imam, index) => {
        const isCompleted = completedIds.includes(imam.id);
        const isUnlocked = unlockedIds.includes(imam.id) || imam.id === 1;
        const isLeft = index % 2 === 0;

        return (
          <div key={imam.id} className="relative w-full flex flex-col items-center">
            {/* Connector Line */}
            {index < IMAMS.length - 1 && (
              <div 
                className={`absolute w-[3px] h-full top-20 left-1/2 -translate-x-1/2 transition-colors duration-1000 ${isCompleted ? 'bg-gradient-to-b from-amber-400 to-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'bg-white/10'}`} 
                style={{ zIndex: 0 }} 
              />
            )}

            <div className={`flex w-full items-center mb-12 relative z-10 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className="flex-1 flex justify-end px-4">
                {isLeft && (
                  <div className={`glass-panel p-4 flex-1 transition-all ${isUnlocked ? 'border-amber-400/30 bg-black/40' : 'opacity-50'}`}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-arabic text-2xl mb-1 text-amber-100">{imam.name}</h3>
                    </div>
                    <p className="text-sm text-emerald-200/80 mb-2">{imam.title}</p>
                    <p className="text-xs text-white/50">{imam.birthCity} • {imam.burialCity}</p>
                  </div>
                )}
              </div>

              <div className="relative flex-none flex items-center justify-center -mx-1">
                {isUnlocked && !isCompleted && (
                  <div className="absolute inset-0 bg-emerald-500 rounded-full animate-pulse blur-md z-0 opacity-50" />
                )}
                <button 
                  onClick={() => setSelectedNode({ imam, isUnlocked, isCompleted })}
                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-110 active:scale-95 relative ${
                    isCompleted ? 'bg-amber-500 text-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.6)]' :
                    isUnlocked ? 'bg-emerald-700 text-white shadow-emerald-500/50 border-2 border-emerald-400' :
                    'bg-slate-800/80 text-white/30 border border-white/10'
                  }`}
                >
                  {isCompleted ? <span className="text-2xl">✨</span> : isUnlocked ? <span className="font-arabic text-2xl drop-shadow-md">{imam.id}</span> : <LockIcon size={24} />}
                </button>
              </div>

              <div className="flex-1 px-4">
                {!isLeft && (
                  <div className={`glass-panel p-4 flex-1 text-right transition-all ${isUnlocked ? 'border-amber-400/30 bg-black/40' : 'opacity-50'}`}>
                    <div className="flex justify-between items-start flex-row-reverse">
                      <h3 className="font-arabic text-2xl mb-1 text-amber-100">{imam.name}</h3>
                    </div>
                    <p className="text-sm text-emerald-200/80 mb-2">{imam.title}</p>
                    <p className="text-xs text-white/50">{imam.birthCity} • {imam.burialCity}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Action Bottom Sheet */}
      <AnimatePresence>
        {selectedNode && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-4" dir="ltr">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNode(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm bg-slate-900 border border-amber-500/20 p-6 rounded-[2rem] rounded-b-xl shadow-2xl flex flex-col items-center"
            >
              <button 
                onClick={() => setSelectedNode(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={16} />
              </button>

              <div className="w-12 h-1.5 bg-white/20 rounded-full mb-6" />

               {/* eslint-disable-next-line local/no-hardcoded-arabic */}
              <h4 className="text-emerald-400 font-arabic text-lg mb-1">{selectedNode.imam.id === 12 ? 'عجّل الله فرجه' : 'عليه السلام'}</h4>
              <h2 className="text-3xl font-arabic font-bold text-amber-400 mb-1">{selectedNode.imam.title}</h2>
              <h3 className="text-xl font-bold text-white mb-2">{selectedNode.imam.name}</h3>
              <p className="text-sm text-emerald-200/60 mb-4">{selectedNode.imam.kunya}</p>
              
              <div className="bg-white/5 p-4 rounded-xl mb-6 w-full text-center border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-sm text-white/90 italic font-medium leading-relaxed relative z-10">"{selectedNode.imam.hadith}"</p>
              </div>

              <div className="flex items-center gap-2 mb-8">
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${selectedNode.isCompleted ? 'bg-amber-500/20 text-amber-400' : selectedNode.isUnlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/50'}`}>
                  Status: {selectedNode.isCompleted ? 'Mastered' : selectedNode.isUnlocked ? 'In Progress' : 'Locked'}
                </span>
                {selectedNode.isUnlocked && <span className="text-xs text-white/50">Level {selectedNode.imam.id} of 12</span>}
              </div>

              <div className="w-full flex flex-col gap-3">
                {selectedNode.isUnlocked ? (
                  <button 
                    onClick={() => {
                      // Pass context or launch drill engine directly in next steps
                      setActiveGame(`imam_drill_${selectedNode.imam.id}`); 
                      setSelectedNode(null);
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <Play size={18} /> Start Drill Session
                  </button>
                ) : (
                  <button 
                    disabled
                    className="w-full bg-black/40 border border-white/5 text-white/30 font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-sm"
                  >
                    <LockIcon size={16} /> Locked · Sequence required
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
