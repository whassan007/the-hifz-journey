import { Check, LockIcon } from 'lucide-react';
import type { UserState } from '../../types';
import { getBiomeEmojis, getBiomeName, getSurahBiome } from '../../utils';
import { SURAHS } from '../../data/registry';

interface JourneyMapProps {
  user: UserState;
  currentSurahId: number;
  setCurrentSurah: (id: number) => void;
}

export const JourneyMap = ({ user, currentSurahId, setCurrentSurah }: JourneyMapProps) => {
  let currentGroupBiome: string | null = null; // Changed Biome to string as Biome type is removed from imports
  
  return (
    <div className="flex flex-col items-center py-4 relative pb-12 w-full max-w-2xl mx-auto">
      {SURAHS.map((surah, index) => {
        const isCompleted = user.completed.some((s) => s.id === surah.id);
        const isCurrent = currentSurahId === surah.id;
        const isUnlocked = isCompleted || (index === 0) || user.completed.some((s) => s.id === SURAHS[index - 1].id);
        const biome = getSurahBiome(surah.id);
        const showBiomeBanner = currentGroupBiome !== biome;
        currentGroupBiome = biome;

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
                      {surah.verseCount} آيات • {isCompleted ? 'متقن' : 'مغلق'}
                    </p>
                  </div>
                )}
              </div>

              <div className="relative flex-none flex items-center justify-center -mx-1">
                {isCurrent && (
                  <div className="absolute inset-0 bg-accent rounded-full animate-pulse-glow blur-sm z-0" />
                )}
                <button 
                  disabled={!isUnlocked}
                  onClick={() => isUnlocked && setCurrentSurah(surah.id)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform transition-transform hover:scale-110 active:scale-95 ${
                    isCompleted ? 'bg-green-500 text-white shadow-green-500/50' :
                    isUnlocked ? 'bg-accent text-white shadow-accent/50' :
                    'bg-slate-700/50 text-white/30 border border-white/10'
                  }`}
                >
                  {isCompleted ? <Check size={28} /> : isUnlocked ? <span className="scale-150">{getBiomeEmojis(biome)[0]}</span> : <LockIcon size={24} />}
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
                      {surah.verseCount} آيات • {isCompleted ? 'متقن' : 'مغلق'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
