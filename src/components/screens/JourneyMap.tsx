import type { UserState, Biome } from '../../types';
import { SURAH_REGISTRY } from '../../data/registry';
import { getBiomeEmojis, getBiomeName } from '../../utils';
import { Check, LockIcon } from 'lucide-react';

interface JourneyMapProps {
  user: UserState;
  setCurrentSurah: (id: number) => void;
}

export const JourneyMap = ({ user, setCurrentSurah }: JourneyMapProps) => {
  let currentGroupBiome: Biome | null = null;
  
  return (
    <div className="flex flex-col items-center py-4 relative pb-12 w-full max-w-2xl mx-auto">
      {SURAH_REGISTRY.map((surah, index) => {
        const isCompleted = user.completed.includes(surah.id);
        const isCurrent = user.currentSurah === surah.id;
        const prevSurahCompleted = index === 0 || user.completed.includes(SURAH_REGISTRY[index - 1].id);
        const isUnlocked = isCompleted || isCurrent || prevSurahCompleted;

        const showBiomeBanner = currentGroupBiome !== surah.biome;
        currentGroupBiome = surah.biome;

        const isLeft = index % 2 === 0;

        return (
          <div key={surah.id} className="relative w-full flex flex-col items-center">
            {showBiomeBanner && (
              <div className="w-full flex justify-center my-6 z-10">
                <div className={`px-4 py-1.5 rounded-full bg-black/40 text-xs font-bold uppercase tracking-widest border border-white/20 flex items-center gap-2`}>
                  <span>{getBiomeEmojis(surah.biome)[0]}</span>
                  <span>{getBiomeName(surah.biome)}</span>
                </div>
              </div>
            )}
            
            {/* Connector Line to next node */}
            {index < SURAH_REGISTRY.length - 1 && (
              <div className={`absolute w-[3px] h-full top-20 left-1/2 -translate-x-1/2 ${isCompleted ? 'bg-gradient-to-b from-accent to-accent' : 'bg-white/10'}`} style={{ zIndex: 0 }} />
            )}

            <div className={`flex w-full items-center mb-10 relative z-10 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className="flex-1 flex justify-end px-4">
                {isLeft && (
                  <div className="text-right">
                    <h3 className="font-arabic text-2xl mb-1">{surah.arabic}</h3>
                    <p className="text-sm text-white/80">{surah.name}</p>
                    <p className={`text-[10px] mt-1 font-bold uppercase tracking-wider ${isCompleted ? 'text-accent' : 'text-white/40'}`}>
                      {surah.verses} آيات • {isCompleted ? 'متقن' : 'مغلق'}
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
                  className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl z-10 border-[2px] shadow-lg transition-transform ${isCurrent ? 'scale-110 border-accent bg-black/40 backdrop-blur-md' : isCompleted ? 'border-accent bg-black/20 backdrop-blur-sm text-accent' : 'border-white/10 bg-black/10 opacity-60 backdrop-blur-sm text-white/40'}`}
                >
                  {isCompleted ? <Check size={28} /> : isUnlocked ? <span className="scale-150">{getBiomeEmojis(surah.biome)[0]}</span> : <LockIcon size={24} />}
                </button>
              </div>

              <div className="flex-1 px-4">
                {!isLeft && (
                  <div className="text-left">
                    <h3 className="font-arabic text-2xl mb-1">{surah.arabic}</h3>
                    <p className="text-sm text-white/80">{surah.name}</p>
                    <p className={`text-[10px] mt-1 font-bold uppercase tracking-wider ${isCompleted ? 'text-accent' : 'text-white/40'}`}>
                      {surah.verses} آيات • {isCompleted ? 'متقن' : 'مغلق'}
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
