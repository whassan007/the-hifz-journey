import type { UserState, AgeGroup } from '../../types';
import { getRank, getNextRank } from '../../utils';
import { BADGES } from '../../data/badges';
import { XPRing } from '../shared/XPRing';
import { Database, ChevronLeft } from 'lucide-react';

interface ProfileViewProps {
  user: UserState;
  onUpdate: (updates: Partial<UserState>) => void;
  onOpenDataSources?: () => void;
}

export const ProfileView = ({ user, onUpdate, onOpenDataSources }: ProfileViewProps) => {
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

      <div className="w-full mt-10">
        <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
          <span>⚙️</span> الإعدادات
        </h3>
        <div className="bg-black/20 rounded-3xl p-5 border border-white/5 backdrop-blur-sm shadow-inner space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <div>
              <span className="font-bold text-paper block">الفئة العمرية</span>
              <span className="text-xs text-white/50">يغير صعوبة الأسئلة وطول الجلسة</span>
            </div>
            <select
              value={user.ageGroup}
              onChange={(e) => onUpdate({ ageGroup: e.target.value as AgeGroup })}
              className="bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-sm text-paper font-medium outline-none"
              dir="ltr"
            >
              <option value="seedling">برعم (٥-٩)</option>
              <option value="sapling">نبتة (١٠-١٥)</option>
              <option value="rising_tree">شجرة صاعدة (١٦-٢٥)</option>
              <option value="mighty_oak">بلوط شامخ (٢٦+)</option>
            </select>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-bold text-paper">المؤثرات الصوتية</span>
            <button 
              onClick={() => onUpdate({ audioEnabled: !user.audioEnabled })}
              className={`w-14 h-8 rounded-full transition-colors relative ${user.audioEnabled ? 'bg-accent' : 'bg-white/20'}`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-md ${user.audioEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-paper">الاهتزاز</span>
            <button 
              onClick={() => onUpdate({ hapticEnabled: !user.hapticEnabled })}
              className={`w-14 h-8 rounded-full transition-colors relative ${user.hapticEnabled ? 'bg-accent' : 'bg-white/20'}`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-md ${user.hapticEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          <div className="pt-4 border-t border-white/5 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-paper">حجم الخط</span>
              <span className="text-paper/70 font-mono">{user.arabicFontSize}px</span>
            </div>
            <input 
              type="range" 
              min="24" max="80" 
              value={user.arabicFontSize}
              onChange={(e) => onUpdate({ arabicFontSize: Number(e.target.value) })}
              className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>
          <div className="pt-4 border-t border-white/5 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-paper">شفافية الخلفية</span>
              <span className="text-paper/70 font-mono">{user.bgOpacity}%</span>
            </div>
            <input 
              type="range" 
              min="10" max="100" 
              value={user.bgOpacity}
              onChange={(e) => onUpdate({ bgOpacity: Number(e.target.value) })}
              className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>
          <div className="pt-3 border-t border-white/5">
            <button 
              onClick={onOpenDataSources}
              className="w-full flex justify-between items-center text-left hover:bg-white/5 p-2 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Database size={18} className="text-paper/70 group-hover:text-accent transition-colors" />
                <span className="font-bold text-paper group-hover:text-accent transition-colors">مصادر البيانات</span>
              </div>
              <ChevronLeft size={18} className="text-paper/40 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
