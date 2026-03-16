import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Trophy, AlertCircle, FileText } from 'lucide-react';
import type { UserState, ReviewRecord } from '../../types';
import { fetchRetentionSummary, type RetentionSummary } from '../../services/apiMock/retentionApi';

interface MemorizationPulseCardProps {
  user: UserState;
  reviews: ReviewRecord[];
  onOpenJourney: () => void;
}

export const MemorizationPulseCard: React.FC<MemorizationPulseCardProps> = ({ user, reviews, onOpenJourney }) => {
  const [data, setData] = useState<RetentionSummary | null>(null);

  useEffect(() => {
    fetchRetentionSummary(user, reviews).then(setData);
  }, [user, reviews]);

  if (!data) {
    return (
      <div className="w-full h-32 bg-black/20 rounded-[2.5rem] animate-pulse border border-white/5 mb-6" />
    );
  }

  // Determine health color
  const isCritical = data.overall_retention_pct < 40;
  const isWarning = data.overall_retention_pct >= 40 && data.overall_retention_pct < 60;
  
  let gaugeColor = 'bg-teal-500';
  let textColor = 'text-teal-400';
  let glowColor = 'shadow-[0_0_15px_rgba(20,184,166,0.5)]';
  
  if (isCritical) {
    gaugeColor = 'bg-red-500';
    textColor = 'text-red-400';
    glowColor = 'shadow-[0_0_15px_rgba(239,68,68,0.5)]';
  } else if (isWarning) {
    gaugeColor = 'bg-amber-400';
    textColor = 'text-amber-400';
    glowColor = 'shadow-[0_0_15px_rgba(251,191,36,0.3)]';
  }

  return (
    <motion.button 
      onClick={onOpenJourney}
      whileHover={{ scale: 0.98 }}
      whileTap={{ scale: 0.95 }}
      className="w-full bg-black/30 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/10 shadow-lg relative mb-4 text-left cursor-pointer transition-all duration-300 block overflow-hidden group"
    >
      {/* Background Graphic Bleed */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-paper flex items-center gap-2">
          حالة الحفظ
          <Brain size={18} className="text-white/40" />
        </h2>
        <span className="text-xs font-bold text-white/50 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
          Memorization
        </span>
      </div>

      <div className="mb-6" dir="ltr">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs text-white/60 font-semibold uppercase tracking-wider">Overall Strength</span>
          <span className={`text-2xl font-black ${textColor}`}>
            {data.overall_retention_pct}%
          </span>
        </div>
        <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden border border-white/5 relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${data.overall_retention_pct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${gaugeColor} ${glowColor}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <FileText size={16} className="text-white/40 mb-1" />
          <span className="font-bold text-paper">{data.total_verses_memorized}</span>
          <span className="text-[10px] text-white/50 font-semibold leading-tight mt-1">آيات<br/>محفوظة</span>
        </div>
        <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <Trophy size={16} className="text-amber-400/60 mb-1" />
          <span className="font-bold text-paper">{data.streak_days}</span>
          <span className="text-[10px] text-white/50 font-semibold leading-tight mt-1">أيام<br/>المواظبة</span>
        </div>
        <div className={`rounded-xl p-3 flex flex-col items-center justify-center text-center transition-colors ${data.surahs_at_risk_count > 0 ? 'bg-red-500/10 border border-red-500/20' : 'bg-white/5'}`}>
          <AlertCircle size={16} className={`${data.surahs_at_risk_count > 0 ? 'text-red-400' : 'text-white/40'} mb-1`} />
          <span className={`font-bold ${data.surahs_at_risk_count > 0 ? 'text-red-400' : 'text-paper'}`}>{data.surahs_at_risk_count}</span>
          <span className="text-[10px] text-white/50 font-semibold leading-tight mt-1">سور<br/>بخطر</span>
        </div>
      </div>
    </motion.button>
  );
};
