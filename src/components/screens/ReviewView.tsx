import UI from '../../data/ui-text.json';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, RefreshCcw, AlertTriangle, BookX } from 'lucide-react';
import type { ReviewRecord, MistakeEntry } from '../../types';

const MOCK_DUE_REVIEWS: ReviewRecord[] = [
  { surahId: 114, verseNumber: 2, easeFactor: 2.1, intervalDays: 1, repetitionCount: 5, nextReviewDate: "2026-03-14", lastReviewed: "2026-03-13", qualityHistory: [4, 3, 2, 4, 3], missCount: 2 },
  { surahId: 112, verseNumber: 4, easeFactor: 2.5, intervalDays: 4, repetitionCount: 3, nextReviewDate: "2026-03-14", lastReviewed: "2026-03-10", qualityHistory: [5, 4, 4], missCount: 0 },
];

const MOCK_MISTAKES: MistakeEntry[] = [
  { id: '1', surahId: 112, questionType: 'fillBlank', userAnswer: UI.ui_59, correctAnswer: UI.ui_58, hintShown: UI.ui_57, date: "2026-03-13T14:30:00Z" }
];

export const ReviewView = () => {
  const [activeTab, setActiveTab] = useState<'due' | 'mistakes'>('due');

  const getUrgencyColor = () => {
    // Mocking urgency: since it's mock data, we just return a color
    return 'border-orange-500/50 bg-orange-500/10 text-orange-400';
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-6 h-full flex flex-col w-full max-w-2xl mx-auto">
      <header className="mb-6 flex justify-between items-end mt-2">
        <div>
          <h2 className="text-3xl font-bold text-paper mb-1 flex items-center gap-2">
            <RefreshCcw size={28} className="text-accent" />
            {UI.ui_2}
          </h2>
          <p className="text-sm text-paper/70 font-arabic">الفهم الأعمق بالمراجعة المتباعدة</p>
        </div>
      </header>

      <div className="flex bg-black/20 p-1.5 rounded-2xl mb-6 shadow-inner border border-white/5">
        <button 
          onClick={() => setActiveTab('due')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'due' ? 'bg-[#3C5B3E] text-paper shadow-md' : 'text-paper/50 hover:text-paper/80'}`}
        >
          <Clock size={16} />
          المستحق للمراجعة
          <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">2</span>
        </button>
        <button 
          onClick={() => setActiveTab('mistakes')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'mistakes' ? 'bg-[#B35E4C] text-paper shadow-md' : 'text-paper/50 hover:text-paper/80'}`}
        >
          <BookX size={16} />
          دفتر الأخطاء
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex-1 overflow-y-auto w-full"
        >
          {activeTab === 'due' && (
            <div className="space-y-4">
              {MOCK_DUE_REVIEWS.length === 0 ? (
                <div className="text-center py-10 bg-black/10 rounded-3xl border border-white/5">
                  <span className="text-4xl mb-4 block">✨</span>
                  <p className="font-bold text-paper/80">أنت على دراية بجميع الآيات!</p>
                  <p className="text-sm text-paper/50">عد لاحقاً للمراجعة</p>
                </div>
              ) : (
                <>
                  <div className="w-full bg-gradient-to-r from-accent to-orange-500 hover:from-orange-500 hover:to-red-500 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all mb-6">
                    <RefreshCcw size={20} />
                    <span>ابدأ جلسة المراجعة المختلطة</span>
                  </div>
                  
                  {MOCK_DUE_REVIEWS.map((review, i) => (
                    <div key={i} className={`p-4 rounded-2xl border backdrop-blur-sm flex items-center justify-between ${getUrgencyColor()}`}>
                      <div className="flex flex-col">
                        <span className="font-bold text-lg mb-1">سورة {review.surahId} — آية {review.verseNumber}</span>
                        <div className="flex gap-4 text-xs opacity-80 font-medium">
                          <span>الفاصل الزمني: {review.intervalDays} أيام</span>
                          <span>السهولة: {(review.easeFactor).toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="text-2xl bg-black/20 w-12 h-12 flex items-center justify-center rounded-xl">
                        {review.easeFactor >= 2.5 ? '🌿' : review.easeFactor >= 2.0 ? '⚡' : '🔥'}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {activeTab === 'mistakes' && (
            <div className="space-y-4 w-full">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-paper/50 uppercase tracking-widest">الأخطاء السابقة ({MOCK_MISTAKES.length})</span>
                <button className="text-xs bg-black/20 hover:bg-black/40 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 border border-white/10 text-paper/80">
                  <AlertTriangle size={12} />
                  <span>تدريب على الأخطاء</span>
                </button>
              </div>

              {MOCK_MISTAKES.map(mistake => (
                <div key={mistake.id} className="bg-black/20 p-5 rounded-2xl border border-white/5 relative overflow-hidden backdrop-blur-sm">
                  <div className="absolute top-0 right-0 w-1.5 h-full bg-[#B35E4C]" />
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-sm bg-black/20 px-3 py-1 rounded-full text-paper/80">سورة {mistake.surahId}</span>
                    <span className="text-[10px] text-paper/50 font-medium">{new Date(mistake.date).toLocaleDateString('ar-SA')}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4 text-center">
                    <div className="bg-[#B35E4C]/10 border border-[#B35E4C]/30 rounded-xl p-3 flex flex-col">
                      <span className="text-[10px] text-[#D98977] uppercase tracking-widest mb-1 font-bold">إجابتك</span>
                      <span className="text-lg font-arabic font-bold text-[#ECA996]">{mistake.userAnswer}</span>
                    </div>
                    <div className="bg-[#3C5B3E]/20 border border-[#A4C3A2]/30 rounded-xl p-3 flex flex-col">
                      <span className="text-[10px] text-[#A4C3A2] uppercase tracking-widest mb-1 font-bold">الصحيح</span>
                      <span className="text-lg font-arabic font-bold text-[#C5DFC3]">{mistake.correctAnswer}</span>
                    </div>
                  </div>
                  
                  <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 flex gap-2">
                    <span className="text-lg">💡</span>
                    <p className="text-xs text-paper/80 leading-relaxed font-arabic mt-1">{mistake.hintShown}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
