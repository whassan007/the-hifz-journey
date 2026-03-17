import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { IMAMS } from '../../data/imams';

export const DailyImamCard = () => {
  // Simple "daily" selection logic based on the current day of the year
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const dailyImamIndex = dayOfYear % 12;
  const imam = IMAMS[dailyImamIndex];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-gradient-to-br from-amber-500/10 to-emerald-500/10 border border-amber-500/20 rounded-2xl p-4 mb-6 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      
      <div className="flex justify-between items-start mb-3 relative z-10">
        <h3 className="font-bold text-amber-400 text-sm flex items-center gap-2">
          <Sparkles size={14} /> إضاءة اليوم
        </h3>
        <span className="text-xs font-arabic text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
          Imam {imam.id}
        </span>
      </div>

      <div className="relative z-10 grid gap-1 mb-3">
        {/* eslint-disable-next-line local/no-hardcoded-arabic */}
        <h2 className="text-2xl font-bold font-arabic text-white mb-0.5 drop-shadow-sm">{imam.name} {imam.id === 12 ? '(عج)' : '(ع)'}</h2>
        <p className="text-sm text-emerald-100/80">{imam.title}</p>
      </div>

      <div className="bg-black/40 border border-white/5 rounded-xl p-3 relative z-10 backdrop-blur-sm">
        <p className="text-sm leading-relaxed text-white/90 italic font-medium">"{imam.hadith}"</p>
      </div>
    </motion.div>
  );
};
