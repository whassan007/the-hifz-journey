import type { UserState, AgeGroup } from '../../types';
import { Database, ChevronLeft, LogOut, Settings } from 'lucide-react';

interface SettingsViewProps {
  user: UserState;
  onUpdate: (updates: Partial<UserState>) => void;
  onOpenDataSources?: () => void;
  onLogout?: () => void;
}

export const SettingsView = ({ user, onUpdate, onOpenDataSources, onLogout }: SettingsViewProps) => {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto pt-6 px-6">
      <div className="w-full">
        <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
          <Settings size={24} /> الإعدادات
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
              className="w-full flex justify-between items-center text-left hover:bg-white/5 p-2 rounded-lg transition-colors group mb-2 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Database size={18} className="text-paper/70 group-hover:text-accent transition-colors" />
                <span className="font-bold text-paper group-hover:text-accent transition-colors">مصادر البيانات</span>
              </div>
              <ChevronLeft size={18} className="text-paper/40 rtl:rotate-180" />
            </button>
            <button 
              onClick={onLogout}
              className="w-full flex justify-between items-center text-left hover:bg-red-500/10 p-2 rounded-lg transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <LogOut size={18} className="text-red-400 group-hover:text-red-500 transition-colors" />
                <span className="font-bold text-red-400 group-hover:text-red-500 transition-colors">تسجيل الخروج (إنهاء الجلسة)</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
