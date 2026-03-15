import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Trophy, Clock, Target, Play, GraduationCap, BookOpen, ChevronRight } from 'lucide-react';
import type { UserState, SurahNode, Class, ClassAssignment } from '../../types';
import { getRank } from '../../utils';
import { JoinClassModal } from './student/JoinClassModal';

// Temporary Mock Data for prototype Demonstration
const MOCK_ACTIVE_ASSIGNMENTS: ClassAssignment[] = [
  { id: 'a1', classId: 'mock', title: 'مراجعة عطلة نهاية الأسبوع', surahRange: 'الكهف (١-١٠)', dueDate: 'الأحد', createdByTeacherId: 'teacher-x' }
];

interface HomeViewProps {
  user: UserState;
  currentSurahData: SurahNode;
  setActiveGame: (game: string) => void;
}

export const HomeView = ({ user, currentSurahData, setActiveGame }: HomeViewProps) => {
  const [isJoiningClass, setIsJoiningClass] = useState(false);
  const rank = getRank(user.xp);

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="p-6">
      <div className="w-full flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-paper mb-1">مرحباً، {user.name}</h1>
          <p className="text-accent font-bold text-lg flex items-center gap-2">{rank.icon} {rank.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-paper/60 uppercase tracking-wider font-bold">المواظبة</p>
          <p className="text-2xl font-black text-paper">{user.streak} <span className="text-accent text-lg">🔥</span></p>
        </div>
      </div>

      {/* Join a Class Banner */}
      <button 
        onClick={() => setIsJoiningClass(true)}
        className="w-full bg-gradient-to-r from-blue-600/20 to-teal-500/20 hover:from-blue-600/30 hover:to-teal-500/30 border border-blue-500/30 rounded-2xl p-4 mb-6 flex items-center justify-between transition-all group active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/50">
             <GraduationCap className="text-blue-400" size={20} />
          </div>
          <div className="text-left flex-1" dir="rtl">
            <h3 className="font-bold text-paper text-sm mb-0.5">انضم إلى صف</h3>
            <p className="text-[11px] text-paper/60">هل لديك رمز من معلمك؟</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white text-white/40 transition-colors shrink-0">
          <span className="text-lg font-bold leading-none mb-0.5">+</span>
        </div>
      </button>

      {/* Active Assignments Banner */}
      {/* Note: Mock logic simulating that the student joined a class if MOCK_ACTIVE_ASSIGNMENTS is present. */}
      {MOCK_ACTIVE_ASSIGNMENTS.length > 0 && (
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex justify-between items-end mb-1">
             <h3 className="font-bold text-paper text-lg">واجبات الصف</h3>
             <button className="text-xs text-accent font-bold">عرض الكل</button>
          </div>
          {MOCK_ACTIVE_ASSIGNMENTS.map(assignment => (
             <button 
               key={assignment.id}
               onClick={() => setActiveGame('quiz')}
               className="w-full bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/20 rounded-2xl p-4 flex items-center justify-between transition-all group text-left"
             >
               <div className="flex gap-4 items-center">
                 <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center border border-white/5 shadow-inner">
                   <BookOpen className="text-blue-400" size={24} />
                 </div>
                 <div>
                    <h4 className="font-bold text-paper mb-0.5">{assignment.title}</h4>
                   <p className="text-xs text-paper/60 flex items-center gap-2">
                     <span>{assignment.surahRange}</span>
                     <span className="w-1 h-1 bg-white/20 rounded-full" />
                     <span className="text-red-400 font-medium">مستحق {assignment.dueDate}</span>
                   </p>
                 </div>
               </div>
               <ChevronRight size={20} className="text-white/40 group-hover:text-blue-400 transition-colors" />
             </button>
          ))}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { label: 'مجموع النقاط', value: user.xp, icon: <Trophy size={20} className="text-statRank-start" />, color: 'bg-statRank-start/20 border-statRank-start/30' },
          { label: 'أيام الدراسة', value: `${user.streak} يوم`, icon: <Clock size={20} className="text-statHikmah-start" />, color: 'bg-statHikmah-start/20 border-statHikmah-start/30' },
          { label: 'الآيات المحفوظة', value: user.completed.length, icon: <Target size={20} className="text-statJungle-start" />, color: 'bg-statJungle-start/20 border-statJungle-start/30' },
          { label: 'معدل الاحتفاظ', value: '95%', icon: <Gamepad2 size={20} className="text-statDesert-start" />, color: 'bg-statDesert-start/20 border-statDesert-start/30' },
        ].map((stat, i) => (
          <div key={i} className={`rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-md backdrop-blur-md border ${stat.color}`}>
            <span className="mb-2">{stat.icon}</span>
            <span className="font-bold text-sm text-paper">{stat.value}</span>
            <span className="text-[10px] text-paper/70 font-semibold">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Next Review Card */}
      <div className="bg-black/20 backdrop-blur-md rounded-[2.5rem] p-6 border border-white/5 shadow-lg relative mb-6 text-center">
        <div className="flex justify-center items-start mb-4">
          <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">المستحق التالي</span>
        </div>
        <div className="mb-4">
          <p className="font-arabic text-3xl leading-loose text-paper mb-4 text-center" style={{ fontSize: `${user.arabicFontSize}px` }}>{currentSurahData.arabicName} · آية ١</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
          <p className="text-sm text-paper/80 leading-relaxed font-arabic">وهذا من أرجى المواضع في القرآن الكريم، حيث لم يجعل الله بينه وبين دعاء عبيده واسطة.</p>
        </div>
      </div>

      {/* Daily Challenge Hero Card */}
      <div className="bg-jungle-dark/80 backdrop-blur-md rounded-[2.5rem] p-6 border border-[#2F4F2F] shadow-lg relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542273917363-3b1817f69a56?q=80&w=1000')] bg-cover bg-center opacity-20 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-jungle-dark/90 to-transparent" />
        
        <div className="relative z-10 text-center">
          <p className="text-accent text-xs font-bold uppercase tracking-widest mb-2 mt-2">هدف اليوم</p>
          <h2 className="text-2xl font-bold mb-1 text-paper">تمت مراجعة ٠ من ١٥ آية</h2>
          <p className="text-sm text-paper/80 mb-5">اربح نقاطاً مضاعفة عند إكمال مراجعات اليوم!</p>
          
          <div className="w-full bg-black/40 h-1.5 rounded-full mb-6 overflow-hidden rtl:-scale-x-100">
            <div className="bg-accent h-full w-1/3 rounded-full" />
          </div>

          <button 
            onClick={() => setActiveGame('quiz')}
            className="mt-6 w-full bg-accent hover:bg-amber-600 active:scale-95 transition-all text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
            <Play size={20} className="fill-current" />
            ابدأ جلسة المراجعة
          </button>
        </div>
      </div>

      {/* Join Class Modal */}
      <AnimatePresence>
        {isJoiningClass && (
          <JoinClassModal 
            onClose={() => setIsJoiningClass(false)}
            onJoin={(c: Class) => {
              alert(`مرحباً بك! You've joined ${c.name}.`);
              setIsJoiningClass(false);
            }}
            alreadyJoinedClasses={[]}
          />
        )}
      </AnimatePresence>

    </motion.div>
  );
};
