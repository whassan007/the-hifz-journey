import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Settings2, ChevronDown, ListChecks, CheckCircle2 } from 'lucide-react';
import type { ReviewRecord } from '../../types';
import { fetchTodaySession, type TodaySessionPlan } from '../../services/apiMock/sessionApi';

interface TodaySessionCardProps {
  reviews: ReviewRecord[];
  onStartSession: (surahId?: number) => void;
  onCustomizeSession?: () => void;
}

export const TodaySessionCard: React.FC<TodaySessionCardProps> = ({ reviews, onStartSession, onCustomizeSession }) => {
  const [session, setSession] = useState<TodaySessionPlan | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchTodaySession(reviews).then(setSession);
  }, [reviews]);

  if (!session) {
    return (
      <div className="w-full bg-jungle-dark/80 backdrop-blur-md rounded-[2.5rem] p-6 border border-[#2F4F2F] shadow-lg relative min-h-[200px] flex items-center justify-center flex-col text-center">
        <CheckCircle2 size={48} className="text-teal-400/50 mb-4" />
        <h3 className="text-xl font-bold text-paper mb-1">جلسة اليوم مكتملة</h3>
        <p className="text-sm text-paper/60">All due reviews are complete. Amazing work!</p>
        
        {onCustomizeSession && (
          <button 
            onClick={onCustomizeSession}
            className="mt-6 text-sm font-bold text-accent flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 hover:bg-accent/10 transition-colors"
          >
            <Settings2 size={16} />
            تخصيص جلسة إضافية
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-jungle-dark/80 backdrop-blur-md rounded-[2.5rem] p-6 border border-[#2F4F2F] shadow-lg relative overflow-hidden mb-8">
      {/* Background Graphic */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542273917363-3b1817f69a56?q=80&w=1000')] bg-cover bg-center opacity-10 mix-blend-luminosity" />
      <div className="absolute inset-0 bg-gradient-to-t from-jungle-dark/90 to-transparent" />
      
      <div className="relative z-10 text-center">
        <p className="text-accent text-xs font-bold uppercase tracking-widest mb-2 mt-2">جلسة اليوم</p>
        
        <h2 className="text-2xl font-bold mb-1 text-paper">~{session.estimated_minutes} Min Session</h2>
        <p className="text-sm text-paper/80 mb-6 max-w-[250px] mx-auto min-h-[40px] flex items-center justify-center">
          {session.total_verses} verses blended from {session.surah_breakdown.length} Surahs
        </p>

        {/* Start Button */}
        <motion.button 
          whileHover={{ scale: 0.98 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onStartSession()} 
          className="w-full bg-accent hover:bg-amber-600 transition-colors text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg z-20 relative cursor-pointer"
        >
          <Play size={20} className="fill-current" />
          ابدأ جلسة المراجعة
        </motion.button>

        {/* Secondary Actions Row */}
        <div className="flex items-center justify-between mt-4">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white/60 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold py-2 px-2 rounded-lg hover:bg-white/5 active:bg-white/10 select-none cursor-pointer group"
          >
             <ListChecks size={14} className="group-hover:text-amber-400 transition-colors" />
             Session Breakdown
             <motion.div
               animate={{ rotate: isExpanded ? 180 : 0 }}
               transition={{ duration: 0.2 }}
             >
               <ChevronDown size={14} className="opacity-50" />
             </motion.div>
          </button>

          {onCustomizeSession && (
            <button 
              onClick={onCustomizeSession}
              className="text-white/40 hover:text-white/80 transition-colors flex items-center gap-1.5 text-xs font-semibold py-2 px-2 rounded-lg hover:bg-white/5 cursor-pointer"
            >
               <Settings2 size={14} />
               تخصيص
            </button>
          )}
        </div>

        {/* Expandable Breakdown Drawer */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="bg-black/40 border border-white/5 rounded-2xl p-4 text-left mt-4 text-sm font-sans">
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3 border-b border-white/10 pb-2">Blended Sources</p>
                
                <ul className="space-y-3">
                  {session.surah_breakdown.map(surah => (
                    <li key={surah.surahId} className="flex grid-cols-2 justify-between items-center text-paper/90">
                      <span className="font-bold">{surah.arabicName}</span>
                      <span className="text-accent text-xs bg-accent/10 px-2 py-0.5 rounded-md font-semibold font-sans">{surah.verseCountDue} verses</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 pt-3 border-t border-white/10">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2">Question Mix</p>
                  <div className="flex flex-wrap gap-1.5">
                     {session.question_type_mix.map(type => (
                       <span key={type} className="text-[10px] bg-white/5 text-white/60 px-2 py-1 rounded-md">{type}</span>
                     ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
