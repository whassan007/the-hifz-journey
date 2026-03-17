import UI from "../../data/ui-text.json";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Trophy, Clock, Target, GraduationCap, BookOpen, ChevronRight } from 'lucide-react';
import type { UserState, Class, ClassAssignment, ReviewRecord, SessionConfig } from '../../types';
import { getRank } from '../../utils';
import { JoinClassModal } from './student/JoinClassModal';
import { MemorizationPulseCard } from '../dashboard/MemorizationPulseCard';
import { TodaySessionCard } from '../dashboard/TodaySessionCard';
import { DailyImamCard } from '../dashboard/DailyImamCard';

const MOCK_ACTIVE_ASSIGNMENTS: ClassAssignment[] = [{
  id: 'a1',
  classId: 'mock',
  title: UI.ui_29,
  surahRange: UI.ui_28,
  dueDate: UI.ui_27,
  createdByTeacherId: 'teacher-x'
}];

interface HomeViewProps {
  user: UserState;
  reviews: ReviewRecord[];
  setActiveGame: (game: string) => void;
  setCurrentSurah: (id: number) => void;
  onOpenSessionConfig: (config?: Partial<SessionConfig>) => void;
}

export const HomeView = ({
  user,
  reviews,
  setActiveGame,
  setCurrentSurah,
  onOpenSessionConfig
}: HomeViewProps) => {
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
      <button onClick={() => setIsJoiningClass(true)} className="w-full bg-gradient-to-r from-blue-600/20 to-teal-500/20 hover:from-blue-600/30 hover:to-teal-500/30 border border-blue-500/30 rounded-2xl p-4 mb-6 flex items-center justify-between transition-all group active:scale-[0.98] cursor-pointer">
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
      {MOCK_ACTIVE_ASSIGNMENTS.length > 0 && <div className="mb-6 flex flex-col gap-3">
          <div className="flex justify-between items-end mb-1">
             <h3 className="font-bold text-paper text-lg">واجبات الصف</h3>
             <button className="text-xs text-accent font-bold cursor-pointer">عرض الكل</button>
          </div>
          {MOCK_ACTIVE_ASSIGNMENTS.map(assignment => <button key={assignment.id} onClick={() => setActiveGame('quiz')} className="w-full bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/20 rounded-2xl p-4 flex items-center justify-between transition-all group text-left cursor-pointer">
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
             </button>)}
        </div>}

      {/* NEW: Component 1 - Passive Memorization Pulse */}
      <MemorizationPulseCard 
        user={user} 
        reviews={reviews} 
        onOpenJourney={() => {
            // Placeholder: The actual routing logic would go here to open Progress Map
            // In App.tsx, this is usually handled by setActiveTab('journey')
            // For now, this is a visual integration as requested.
            setCurrentSurah(1); // dummy action
        }} 
      />

      {/* Daily Imam Feature */}
      <DailyImamCard />

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { label: UI.ui_26, value: user.xp, icon: <Trophy size={20} className="text-statRank-start" />, color: 'bg-statRank-start/20 border-statRank-start/30' },
          { label: UI.ui_25, value: `${user.streak} يوم`, icon: <Clock size={20} className="text-statHikmah-start" />, color: 'bg-statHikmah-start/20 border-statHikmah-start/30' },
          { label: UI.ui_24, value: user.completed.length, icon: <Target size={20} className="text-statJungle-start" />, color: 'bg-statJungle-start/20 border-statJungle-start/30' },
          { label: UI.ui_23, value: '95%', icon: <Gamepad2 size={20} className="text-statDesert-start" />, color: 'bg-statDesert-start/20 border-statDesert-start/30' }
        ].map((stat, i) => (
          <div key={i} className={`rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-md backdrop-blur-md border ${stat.color}`}>
            <span className="mb-2">{stat.icon}</span>
            <span className="font-bold text-sm text-paper">{stat.value}</span>
            <span className="text-[10px] text-paper/70 font-semibold">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* NEW: Component 2 - Active Today's Session Launcher */}
      <TodaySessionCard 
        reviews={reviews}
        onStartSession={() => {
           // Launches the blended API quiz format via config screen with "Due" filter applied
           const dueReviewSurahs = reviews.filter(r => new Date(r.nextReviewDate).getTime() <= new Date().getTime()).map(r => r.surahId);
           onOpenSessionConfig({ surahIds: Array.from(new Set(dueReviewSurahs)), difficulty: 'Adaptive' });
        }}
        onCustomizeSession={() => {
           // Opens config with defaults
           onOpenSessionConfig();
        }}
      />

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