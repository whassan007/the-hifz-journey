import type { UserState } from '../../types';
import { getRank, getNextRank } from '../../utils';
import { BADGES } from '../../data/badges';
import { XPRing } from '../shared/XPRing';

interface ProfileViewProps {
  user: UserState;
}

export const ProfileView = ({ user }: ProfileViewProps) => {
  const rank = getRank(user.xp);
  const nextRank = getNextRank(user.xp);
  
  const currentLevelXp = user.xp - rank.minXp;
  const nextLevelXp = nextRank ? nextRank.minXp - rank.minXp : 1000;
  const progressPercent = nextRank ? Math.min(100, Math.max(0, (currentLevelXp / nextLevelXp) * 100)) : 100;
  
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <XPRing progressPercent={progressPercent} icon={rank.icon} />
      
      <h2 className="text-3xl font-bold mb-1">{user.name}</h2>
      <p className="text-accent font-bold text-lg mb-2 flex items-center gap-2">{rank.icon} {rank.name}</p>
      <p className="text-sm text-white/60 mb-10 max-w-xs text-center font-medium bg-black/20 rounded-full px-4 py-1.5 border border-white/5">
        {user.xp} نقاط &nbsp;•&nbsp; {user.hikmah} حكمة &nbsp;•&nbsp; {user.completed.length} سور
      </p>

      <div className="w-full">
        <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
          <span>🏆</span> خزانة الجوائز
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BADGES.map((badge) => {
            const isUnlocked = user.badges.includes(badge.id);
            return (
              <div 
                key={badge.id}
                className={`rounded-3xl p-4 flex flex-col border shadow-lg transition-all ${isUnlocked ? 'bg-gradient-to-br from-black/20 to-accent/10 border-accent/30 opacity-100 backdrop-blur-md' : 'bg-black/10 border-white/5 opacity-40 grayscale backdrop-blur-sm'}`}
              >
                <div className="bg-black/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-inner">
                  {badge.icon}
                </div>
                <span className="font-bold text-sm mb-1">{badge.name}</span>
                <span className="text-[11px] text-white/60 leading-tight">{badge.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
