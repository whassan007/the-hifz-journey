import { motion } from 'framer-motion';
import { Sparkles, Droplet, Flame, Moon, Volume2, Share2, Flower2 } from 'lucide-react';
import type { UserState, SurahNode } from '../../types';
import { getRank } from '../../utils';

interface HomeViewProps {
  user: UserState;
  currentSurahData: SurahNode;
  setActiveGame: (game: string) => void;
}

export const HomeView = ({ user, currentSurahData, setActiveGame }: HomeViewProps) => {
  const rank = getRank(user.xp);

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="p-6">
      <header className="flex justify-between items-center mb-10 mt-2">
        <div>
          <p className="text-sm text-paper/70 font-arabic mb-1">سلام،</p>
          <h1 className="text-3xl font-bold text-paper">{user.name}!</h1>
        </div>
        <div className="relative w-16 h-16 flex items-center justify-center bg-black/20 rounded-[1.25rem] border border-white/10 shadow-inner backdrop-blur-sm">
          {rank.icon}
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3 md:gap-6 mb-8">
        {[
          { label: 'النقاط', value: user.xp, icon: <Droplet size={20} className="text-[#B46A41]" />, color: 'bg-[#B46A41]/20 border-[#B46A41]/30' },
          { label: 'استمرار', value: `${user.streak}d`, icon: <Flame size={20} className="text-[#D98977]" />, color: 'bg-[#D98977]/20 border-[#D98977]/30' },
          { label: 'الرتبة', value: rank.name, icon: rank.icon, color: 'bg-statRank-start/20 border-statRank-start/30' },
          { label: 'الحكمة', value: user.hikmah, icon: <Moon size={20} className="text-statHikmah-start" />, color: 'bg-statHikmah-start/20 border-statHikmah-start/30' },
        ].map((stat, i) => (
          <div key={i} className={`rounded-3xl p-3 flex flex-col items-center justify-center text-center shadow-md backdrop-blur-md border ${stat.color}`}>
            <span className="mb-2">{stat.icon}</span>
            <span className="font-bold text-sm text-paper">{stat.value}</span>
            <span className="text-[10px] text-paper/70 font-semibold">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Verse-of-the-Day Card */}
      <div className="bg-black/20 backdrop-blur-md rounded-[2.5rem] p-6 border border-white/5 shadow-lg relative mb-6">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">آية اليوم</span>
          <div className="flex gap-2">
            <button className="text-paper/40 hover:text-accent transition-colors bg-white/5 p-2 rounded-full border border-white/5 active:scale-95">
              <Volume2 size={16} />
            </button>
            <button className="text-paper/40 hover:text-accent transition-colors bg-white/5 p-2 rounded-full border border-white/5 active:scale-95">
              <Share2 size={16} />
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="font-arabic text-3xl leading-loose text-paper mb-4 text-center" style={{ fontSize: `${user.arabicFontSize}px` }}>وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
          <p className="text-xs text-paper/40 font-bold uppercase tracking-widest mb-1">تفسير الميزان</p>
          <p className="text-sm text-paper/80 leading-relaxed font-arabic">وهذا من أرجى المواضع في القرآن الكريم، حيث لم يجعل الله بينه وبين دعاء عبيده واسطة.</p>
        </div>

        <button className="w-full bg-[#3C5B3E]/30 hover:bg-[#3C5B3E]/50 text-[#A4C3A2] border border-[#A4C3A2]/30 font-bold py-3 px-6 rounded-2xl transition-colors shadow-sm flex items-center justify-center gap-2">
          <Flower2 size={18} />
          <span>حفظ في حديقتي</span>
        </button>
      </div>

      {/* Daily Challenge Hero Card */}
      <div className="bg-jungle-dark/80 backdrop-blur-md rounded-[2.5rem] p-6 border border-[#2F4F2F] shadow-lg relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542273917363-3b1817f69a56?q=80&w=1000')] bg-cover bg-center opacity-20 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-jungle-dark/90 to-transparent" />
        
        <div className="relative z-10">
          <div className="absolute top-0 left-0 text-accent opacity-30">
            <Sparkles size={48} />
          </div>
          <p className="text-accent text-xs font-bold uppercase tracking-widest mb-2 mt-2">التحدي اليومي</p>
          <h2 className="text-2xl font-bold mb-1 text-paper">سورة {currentSurahData.arabic}</h2>
          <p className="text-sm text-paper/80 mb-5">احصل على ضعف النقاط اليوم!</p>
          
          <div className="w-full bg-black/40 h-1.5 rounded-full mb-6 overflow-hidden">
            <div className="bg-accent h-full w-1/3 rounded-full" />
          </div>

          <button 
            onClick={() => setActiveGame('quiz')}
            className="w-full bg-[#5E3A1A] hover:bg-[#8B5A2B] text-paper font-bold py-3.5 px-6 rounded-2xl transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <span>ابدأ التحدي</span>
            <span>←</span>
          </button>
        </div>
      </div>

    </motion.div>
  );
};
