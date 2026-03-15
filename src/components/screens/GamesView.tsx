import UI from '../../data/ui-text.json';
import { motion } from 'framer-motion';
import { Gamepad2, Edit3, Puzzle, Link as LinkIcon, Mic, TreePine, Lightbulb, Map as MapIcon } from 'lucide-react';

interface GamesViewProps {
  setActiveGame: (game: string) => void;
}

export const GamesView = ({ setActiveGame }: GamesViewProps) => {
  return (
    <div className="flex flex-col p-6 w-full max-w-4xl mx-auto h-full pb-32">
      <header className="mb-6 mt-2">
        <h2 className="text-3xl font-bold text-paper mb-1 flex items-center gap-2">
          <Gamepad2 size={28} className="text-accent" />
          تحديات الحفظ
        </h2>
        <p className="text-sm text-paper/70 font-arabic">أنماط تعلم متعددة لاختبار ذاكرتك.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-4">
        {[
          { id: 'quiz', name: UI.ui_20, desc: UI.ui_19, icon: <Edit3 className="mb-3 text-[#A4C3A2]" size={28} />, color: 'bg-[#A4C3A2]/10 border-[#A4C3A2]/20 hover:bg-[#A4C3A2]/20' },
          { id: 'scramble', name: UI.ui_18, desc: UI.ui_17, icon: <Puzzle className="mb-3 text-[#8DB3C3]" size={28} />, color: 'bg-[#8DB3C3]/10 border-[#8DB3C3]/20 hover:bg-[#8DB3C3]/20' },
          { id: 'match', name: UI.ui_16, desc: UI.ui_15, icon: <LinkIcon className="mb-3 text-[#B0A8C9]" size={28} />, color: 'bg-[#B0A8C9]/10 border-[#B0A8C9]/20 hover:bg-[#B0A8C9]/20' },
          { id: 'tajweed', name: UI.ui_14, desc: UI.ui_13, icon: <Mic className="mb-3 text-[#D4B895]" size={28} />, color: 'bg-[#D4B895]/10 border-[#D4B895]/20 hover:bg-[#D4B895]/20' },
          { id: 'vine_climb', name: UI.ui_12, desc: UI.ui_11, icon: <TreePine className="mb-3 text-[#4CAF50]" size={28} />, color: 'bg-[#4CAF50]/10 border-[#4CAF50]/20 hover:bg-[#4CAF50]/20' },
          { id: 'lantern_trail', name: UI.ui_10, desc: UI.ui_9, icon: <Lightbulb className="mb-3 text-[#FFC107]" size={28} />, color: 'bg-[#FFC107]/10 border-[#FFC107]/20 hover:bg-[#FFC107]/20' },
          { id: 'oasis_puzzle', name: UI.ui_8, desc: UI.ui_7, icon: <MapIcon className="mb-3 text-[#00BCD4]" size={28} />, color: 'bg-[#00BCD4]/10 border-[#00BCD4]/20 hover:bg-[#00BCD4]/20' },
        ].map((mode, index) => (
          <motion.button 
            key={mode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setActiveGame(mode.id)}
            className={`${mode.color} border p-4 rounded-3xl flex flex-col items-center justify-center text-center transition-all shadow-md backdrop-blur-sm active:scale-95 group relative overflow-hidden h-36`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {mode.icon}
            <span className="font-bold text-sm mb-1 text-paper relative z-10">{mode.name}</span>
            <span className="text-[10px] text-paper/60 uppercase tracking-wider relative z-10">{mode.desc}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
