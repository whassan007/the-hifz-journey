import UI from '../../data/ui-text.json';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, LockIcon, Bookmark, X, BookOpen, Play } from 'lucide-react';
import type { UserState, SurahNode } from '../../types';
import { getBiomeEmojis, getBiomeName, getSurahBiome } from '../../utils';
import { SURAHS } from '../../data/registry';

interface JourneyMapProps {
  user: UserState;
  currentSurahId: number;
  setCurrentSurah: (id: number) => void;
  onReadSurah: (id: number) => void;
  onOpenBookmarks: () => void;
}

export const JourneyMap = ({ user, currentSurahId, setCurrentSurah, onReadSurah, onOpenBookmarks }: JourneyMapProps) => {
  const [selectedNode, setSelectedNode] = useState<{ surah: SurahNode, isUnlocked: boolean, isCompleted: boolean } | null>(null);

  // Helper to determine highlight status and color
  const getHighlightInfo = (surahId: number) => {
    if (!user.highlights) return null;
    const surahHighlights = user.highlights.filter(h => h.surahId === surahId);
    if (surahHighlights.length === 0) return null;
    
    // Sort by newest first and get color
    const latest = surahHighlights.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    return latest.color;
  };
  
  return (
    <div className="flex flex-col items-center py-4 relative pb-12 w-full max-w-2xl mx-auto">
      
      {/* Header Actions */}
      <div className="w-full px-6 mb-4 flex justify-end sticky top-4 z-40">
        <button 
          onClick={onOpenBookmarks}
          className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full w-12 h-12 flex items-center justify-center text-white/80 hover:text-accent hover:bg-black/60 hover:scale-105 transition-all shadow-lg"
          title="My Bookmarks"
        >
          <Bookmark size={20} />
          {user.bookmarks?.length > 0 && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-accent border-2 border-black rounded-full" />
          )}
        </button>
      </div>

      {SURAHS.map((surah, index) => {
        const isCompleted = user.completed.some((s) => s.id === surah.id);
        const isCurrent = currentSurahId === surah.id;
        const isUnlocked = isCompleted || (index === 0) || user.completed.some((s) => s.id === SURAHS[index - 1].id);
        const biome = getSurahBiome(surah.id);
        const previousBiome = index > 0 ? getSurahBiome(SURAHS[index - 1].id) : null;
        const showBiomeBanner = previousBiome !== biome;

        const isLeft = index % 2 === 0;

        return (
          <div key={surah.id} className="relative w-full flex flex-col items-center">
            {showBiomeBanner && (
              <div className="w-full flex justify-center my-6 z-10">
                <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-lg flex items-center gap-3">
                  <span>{getBiomeEmojis(biome)[0]}</span>
                  <span>{getBiomeName(biome)}</span>
                </div>
              </div>
            )}
            
            {/* Connector Line to next node */}
            {index < SURAHS.length - 1 && (
              <div className={`absolute w-[3px] h-full top-20 left-1/2 -translate-x-1/2 ${isCompleted ? 'bg-gradient-to-b from-accent to-accent' : 'bg-white/10'}`} style={{ zIndex: 0 }} />
            )}

            <div className={`flex w-full items-center mb-10 relative z-10 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className="flex-1 flex justify-end px-4">
                {isLeft && (
                  <div className="glass-panel p-4 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-arabic text-2xl mb-1">{surah.arabicName}</h3>
                      <p className="text-sm text-white/80">{surah.transliteration}</p>
                    </div>
                    <p className="text-xs text-white/60 mt-2 font-mono">
                      {surah.verseCount} آيات • {isCompleted ? UI.ui_31 : UI.ui_30}
                    </p>
                  </div>
                )}
              </div>

              <div className="relative flex-none flex items-center justify-center -mx-1">
                {isCurrent && (
                  <div className="absolute inset-0 bg-accent rounded-full animate-pulse-glow blur-sm z-0" />
                )}
                <button 
                  onClick={() => setSelectedNode({ surah, isUnlocked, isCompleted })}
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform transition-transform hover:scale-110 active:scale-95 relative ${
                    isCompleted ? 'bg-green-500 text-white shadow-green-500/50' :
                    isUnlocked ? 'bg-accent text-white shadow-accent/50' :
                    'bg-slate-700/50 text-white/30 border border-white/10'
                  }`}
                >
                  {isCompleted ? <Check size={28} /> : isUnlocked ? <span className="scale-150">{getBiomeEmojis(biome)[0]}</span> : <LockIcon size={24} />}
                  
                  {/* Surah Number Bubble - Left aligned */}
                  <div className={`absolute -ml-3 left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-jungle-dark shadow-lg bg-black text-white font-bold z-10 transition-all duration-300 group-hover:scale-110`}>
                    {surah.id}
                  </div>
                  
                  {/* Indicators (Has Bookmarks / Highlights) */}
                  <div className="absolute -left-1 -top-1 flex gap-1 z-20">
                    {user.bookmarks?.some(b => b.surahId === surah.id) && (
                      <div className="w-3.5 h-3.5 rounded-full bg-accent border-2 border-jungle-dark shadow-sm" />
                    )}
                    {getHighlightInfo(surah.id) && (
                      <div className={`w-3.5 h-3.5 rounded-full bg-${getHighlightInfo(surah.id)}-500 border-2 border-jungle-dark shadow-sm flex items-center justify-center`}>
                        <div className="w-1.5 h-1.5 rounded-sm bg-white/50" />
                      </div>
                    )}
                  </div>
                </button>
              </div>

              <div className="flex-1 px-4">
                {!isLeft && (
                  <div className="glass-panel p-4 flex-1 text-right">
                    <div className="flex justify-between items-start flex-row-reverse">
                      <h3 className="font-arabic text-2xl mb-1">{surah.arabicName}</h3>
                      <p className="text-sm text-white/80">{surah.transliteration}</p>
                    </div>
                    <p className="text-xs text-white/60 mt-2 font-mono">
                      {surah.verseCount} آيات • {isCompleted ? UI.ui_31 : UI.ui_30}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {/* Surah Action Bottom Sheet */}
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
              className="relative w-full max-w-sm bg-jungle-dark border border-white/10 p-6 rounded-[2rem] rounded-b-xl shadow-2xl flex flex-col items-center"
            >
              <button 
                onClick={() => setSelectedNode(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={16} />
              </button>

              <div className="w-12 h-1.5 bg-white/20 rounded-full mb-6" />

              <h2 className="text-4xl font-arabic font-bold text-paper mb-2">{selectedNode.surah.arabicName}</h2>
              <p className="text-paper/80 font-bold mb-1">{selectedNode.surah.transliteration} · {selectedNode.surah.verseCount} verses · Juz {selectedNode.surah.juzNumber} · {selectedNode.surah.revelationType}</p>
              <div className="flex items-center gap-2 mb-8">
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${selectedNode.isCompleted ? 'bg-green-500/20 text-green-400' : selectedNode.isUnlocked ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white/50'}`}>
                  Status: {selectedNode.isCompleted ? 'Mastered' : selectedNode.isUnlocked ? 'In Progress' : 'Locked'}
                </span>
                {selectedNode.isUnlocked && <span className="text-xs text-white/50">Retention: 94%</span>}
              </div>

              <div className="w-full flex flex-col gap-3">
                <button 
                  onClick={() => {
                    onReadSurah(selectedNode.surah.id);
                    setSelectedNode(null);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <BookOpen size={18} /> Read Surah · اقرأ السورة
                </button>

                {selectedNode.isUnlocked ? (
                  <button 
                    onClick={() => {
                      setCurrentSurah(selectedNode.surah.id);
                      setSelectedNode(null);
                    }}
                    className="w-full bg-accent/20 border border-accent/40 text-accent hover:bg-accent/30 font-bold py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Play size={18} /> Start Review · ابدأ المراجعة
                  </button>
                ) : (
                  <button 
                    disabled
                    className="w-full bg-black/40 border border-white/5 text-white/30 font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-sm"
                  >
                    <LockIcon size={16} /> Locked · Complete previous surah first
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
