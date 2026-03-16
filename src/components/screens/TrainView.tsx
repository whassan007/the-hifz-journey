import React from 'react';
import { motion } from 'framer-motion';
import { Ear, Eye, Hand, Sparkles } from 'lucide-react';
import UI from '../../data/ui-text.json';

interface TrainViewProps {
  setActiveTab: (tab: string) => void;
  setActiveGame: (game: string | null) => void;
  setCurrentSurahId: (id: number) => void;
}

export const TrainView: React.FC<TrainViewProps> = ({ setActiveGame }) => {
  return (
    <div className="p-6 pt-12 max-w-2xl mx-auto text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* eslint-disable-next-line local/no-hardcoded-arabic */}
        <h1 className="text-3xl font-bold mb-2">{(UI as Record<string, string>).ui_98 || 'التدريب'}</h1>
        <p className="text-paper/70 mb-8">Multi-Sensory Memorization Engine</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => setActiveGame('deep_memorization')}
            className="flex items-center gap-4 bg-jungle-wood/30 hover:bg-jungle-wood/50 p-6 rounded-2xl backdrop-blur-md border border-white/10 transition-colors text-right w-full"
          >
            <div className="p-4 bg-jungle-light rounded-xl text-jungle-dark">
              <Sparkles size={28} />
            </div>
            <div className="flex-1">
              {/* eslint-disable-next-line local/no-hardcoded-arabic */}
              <h3 className="text-xl font-bold">{(UI as Record<string, string>).ui_99 || 'الحفظ العميق'}</h3>
              <p className="text-sm text-paper/70 mt-1">Deep Memorization (6 Phases)</p>
            </div>
          </button>

          <button 
            onClick={() => setActiveGame('spatial_memory')}
            className="flex items-center gap-4 bg-teal-900/40 hover:bg-teal-900/60 p-6 rounded-2xl backdrop-blur-md border border-white/10 transition-colors text-right w-full"
          >
            <div className="p-4 bg-teal-400 rounded-xl text-teal-900">
              <Eye size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">الذاكرة البصرية</h3>
              <p className="text-sm text-paper/70 mt-1">Spatial Memory & Masking</p>
            </div>
          </button>

          <button 
            onClick={() => setActiveGame('audio_recall')}
            className="flex items-center gap-4 bg-purple-900/40 hover:bg-purple-900/60 p-6 rounded-2xl backdrop-blur-md border border-white/10 transition-colors text-right w-full"
          >
            <div className="p-4 bg-purple-400 rounded-xl text-purple-900">
              <Ear size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">الذاكرة السمعية</h3>
              <p className="text-sm text-paper/70 mt-1">Audio Active Recall & Maqam</p>
            </div>
          </button>

          <button 
            onClick={() => setActiveGame('kinesthetic_tracking')}
            className="flex items-center gap-4 bg-orange-900/40 hover:bg-orange-900/60 p-6 rounded-2xl backdrop-blur-md border border-white/10 transition-colors text-right w-full"
          >
            <div className="p-4 bg-orange-400 rounded-xl text-orange-900">
              <Hand size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">الذاكرة الحركية</h3>
              <p className="text-sm text-paper/70 mt-1">Tracing & Kinesthetic Tracking</p>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
