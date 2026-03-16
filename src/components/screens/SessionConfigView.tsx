import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Search, Play, Save, History, ChevronDown, ChevronUp, Clock, AlertTriangle } from 'lucide-react';
import type { UserState, ReviewRecord, SessionConfig, SessionPreset, QuestionType, DifficultyTier, VerseRange } from '../../types';
import { SURAHS } from '../../data/registry';

const ALL_QUESTION_TYPES: QuestionType[] = [
  'Word Scramble', 'Fill-in-the-Blank', 'First-Letter Scaffolding', 
  'Direct Indexing', 'Positional Mastery', 'Verse-to-Page Mapping', 
  'Contextual Flow Forward', 'Contextual Flow Reverse', 'Mutashabihat Match', 
  'Disambiguation', 'Chain Interruption', 'Oral Recitation'
];

const DIFFICULTY_TIERS: DifficultyTier[] = ['Adaptive', 'Beginner', 'Intermediate', 'Advanced', 'Very Advanced'];
const PRESET_COUNTS = [10, 25, 50, 100];

interface SessionConfigViewProps {
  user: UserState;
  reviews: ReviewRecord[];
  initialConfig?: SessionConfig | null;
  onLaunch: (config: SessionConfig) => void;
  onClose: () => void;
}

export const SessionConfigView: React.FC<SessionConfigViewProps> = ({ user, reviews, initialConfig, onLaunch, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurahs, setSelectedSurahs] = useState<Set<number>>(new Set(initialConfig?.surahIds || []));
  const [verseRanges, setVerseRanges] = useState<Record<number, VerseRange>>(initialConfig?.verseRanges || {});
  
  const [questionCount, setQuestionCount] = useState<number>(initialConfig?.questionCount || 25);
  const [isCustomCount, setIsCustomCount] = useState(false);
  const [customCountValue, setCustomCountValue] = useState(questionCount.toString());
  
  const [difficulty, setDifficulty] = useState<DifficultyTier>(initialConfig?.difficulty || 'Adaptive');
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<Set<QuestionType>>(
    new Set(initialConfig?.questionTypes || ALL_QUESTION_TYPES)
  );
  
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [presets, setPresets] = useState<SessionPreset[]>([]);
  const [recentConfigs, setRecentConfigs] = useState<SessionConfig[]>([]);

  useEffect(() => {
    const savedPresets = localStorage.getItem('hifz_session_presets');
    const savedRecents = localStorage.getItem('hifz_recent_sessions');
    
    // Defer state updates if needed, though this is initial load initialization
    const loadData = () => {
      if (savedPresets) setPresets(JSON.parse(savedPresets));
      if (savedRecents) setRecentConfigs(JSON.parse(savedRecents));
    };
    loadData();
  }, []);

  const totalSelectedVerses = useMemo(() => {
    return Array.from(selectedSurahs).reduce((tot, surahId) => {
      const range = verseRanges[surahId];
      if (range) return tot + (range.end - range.start + 1);
      const surah = SURAHS.find(s => s.id === surahId);
      return tot + (surah?.verseCount || 0);
    }, 0);
  }, [selectedSurahs, verseRanges]);

  const toggleSurah = (surahId: number) => {
    const newSet = new Set(selectedSurahs);
    if (newSet.has(surahId)) {
      newSet.delete(surahId);
    } else {
      newSet.add(surahId);
    }
    setSelectedSurahs(newSet);
  };

  const applyFilter = (filter: string) => {
    const newSet = new Set(selectedSurahs);
    if (filter === 'last_10') {
      for (let i = 105; i <= 114; i++) newSet.add(i);
    } else if (filter === 'due') {
      const now = new Date();
      reviews.filter(r => new Date(r.nextReviewDate).getTime() <= now.getTime())
             .forEach(r => newSet.add(r.surahId));
    } else if (filter === 'memorized') {
      user.completed.forEach(c => newSet.add(c.id));
    }
    setSelectedSurahs(newSet);
  };

  const handleLaunch = () => {
    if (selectedSurahs.size === 0 || questionCount < 1) return;
    
    const config: SessionConfig = {
      surahIds: Array.from(selectedSurahs),
      verseRanges,
      questionCount,
      questionTypes: Array.from(selectedQuestionTypes),
      difficulty
    };

    // Save to recents
    const updatedRecents = [config, ...recentConfigs.filter(c => JSON.stringify(c) !== JSON.stringify(config))].slice(0, 3);
    setRecentConfigs(updatedRecents);
    localStorage.setItem('hifz_recent_sessions', JSON.stringify(updatedRecents));

    onLaunch(config);
  };

  const savePreset = () => {
    const name = prompt('Name for this preset?');
    if (!name) return;
    
    const newPreset: SessionPreset = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      config: {
        surahIds: Array.from(selectedSurahs),
        verseRanges,
        questionCount,
        questionTypes: Array.from(selectedQuestionTypes),
        difficulty
      }
    };
    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem('hifz_session_presets', JSON.stringify(updated));
  };

  const loadConfig = (config: SessionConfig) => {
    setSelectedSurahs(new Set(config.surahIds));
    setVerseRanges(config.verseRanges || {});
    setQuestionCount(config.questionCount);
    setSelectedQuestionTypes(new Set(config.questionTypes));
    setDifficulty(config.difficulty);
    setIsCustomCount(!PRESET_COUNTS.includes(config.questionCount));
    setCustomCountValue(config.questionCount.toString());
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute inset-0 z-50 bg-jungle-dark flex flex-col pt-10 pb-24 h-full overflow-hidden" dir="rtl">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-jungle-dark/80 backdrop-blur-md z-10 sticky top-0">
        { }
        <h1 className="text-xl font-bold text-paper">إعدادات الجلسة</h1>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition">
          <X size={20} className="text-paper/70" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-40 space-y-8">
        
        {/* Presets & History */}
        {(presets.length > 0 || recentConfigs.length > 0) && (
          <section>
            <h2 className="text-sm font-bold text-paper/50 uppercase tracking-widest mb-3 flex items-center gap-2">
              <History size={16} /> Presets & History
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
              {presets.map(p => (
                <button key={p.id} onClick={() => loadConfig(p.config)} className="bg-accent/20 border border-accent/40 rounded-xl px-4 py-3 shrink-0 flex flex-col items-start gap-1 hover:bg-accent/30 transition text-left cursor-pointer" dir="ltr">
                  <span className="font-bold text-accent text-sm whitespace-nowrap">{p.name}</span>
                  <span className="text-[10px] text-accent/70">{p.config.surahIds.length} Surahs · {p.config.questionCount} Qs</span>
                </button>
              ))}
              {recentConfigs.map((c, i) => (
                <button key={`recent-${i}`} onClick={() => loadConfig(c)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 shrink-0 flex flex-col items-start gap-1 hover:bg-white/10 transition text-left cursor-pointer" dir="ltr">
                  <span className="font-bold text-paper text-sm whitespace-nowrap">Recent {i+1}</span>
                  <span className="text-[10px] text-paper/50">{c.surahIds.length} Surahs · {c.questionCount} Qs</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Surah Selector */}
        <section>
          <div className="flex justify-between items-end mb-3">
            { }
            <h2 className="text-lg font-bold text-paper flex items-center gap-2">اختيار السور <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full">{selectedSurahs.size} محددة</span></h2>
            { }
            <button onClick={savePreset} disabled={selectedSurahs.size === 0} className="text-xs text-accent font-bold flex items-center gap-1 opacity-80 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed">
              <Save size={14} /> حفظ كإعداد مسبق
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 mb-4 no-scrollbar">
            { }
            <button onClick={() => applyFilter('last_10')} className="bg-white/5 border border-white/10 text-white/80 px-4 py-1.5 rounded-full text-xs font-bold shrink-0 hover:bg-white/10 active:scale-95 transition">آخر 10 سور</button>
            { }
            <button onClick={() => applyFilter('due')} className="bg-white/5 border border-white/10 text-white/80 px-4 py-1.5 rounded-full text-xs font-bold shrink-0 hover:bg-white/10 active:scale-95 transition">للمراجعة اليوم</button>
            { }
            <button onClick={() => applyFilter('memorized')} className="bg-white/5 border border-white/10 text-white/80 px-4 py-1.5 rounded-full text-xs font-bold shrink-0 hover:bg-white/10 active:scale-95 transition">كل المحفوظ</button>
          </div>

          <div className="relative mb-3">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              // eslint-disable-next-line local/no-hardcoded-arabic
              placeholder="ابحث عن سورة..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pr-11 pl-4 text-white focus:outline-none focus:border-accent transition"
            />
          </div>

          <div className="bg-black/20 border border-white/5 rounded-2xl overflow-hidden h-72 flex flex-col">
            <div className="overflow-y-auto flex-1 p-2 space-y-1">
              {SURAHS.filter(s => s.arabicName.includes(searchQuery) || s.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toString() === searchQuery).map(surah => {
                const isSelected = selectedSurahs.has(surah.id);
                const isCompleted = user.completed.some(c => c.id === surah.id);
                // Simple dot status: gold = completed, teal = in progress, grey = not started
                let dotColor = 'bg-white/20';
                if (isCompleted) dotColor = 'bg-yellow-400';
                else if (reviews.some(r => r.surahId === surah.id)) dotColor = 'bg-teal-400';

                return (
                  <div key={surah.id} className={`flex items-center justify-between p-3 rounded-xl transition cursor-pointer select-none ${isSelected ? 'bg-accent/20 border-accent/40 border' : 'hover:bg-white/5 border border-transparent'}`} onClick={() => toggleSurah(surah.id)}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isSelected ? 'bg-accent text-white' : 'bg-black/40 text-white/50'}`}>
                        {isSelected ? <Check size={16} /> : surah.id}
                      </div>
                      <div>
                        <h4 className="font-arabic font-bold text-lg text-paper leading-none mb-1">{surah.arabicName}</h4>
                        <p className="text-[10px] text-paper/60 leading-none">{surah.transliteration} · {surah.verseCount} verses</p>
                      </div>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full ${dotColor} shadow-sm border border-black/50`} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Question Count */}
        <section>
          <div className="flex justify-between items-end mb-3">
            { }
            <h2 className="text-lg font-bold text-paper">عدد الأسئلة</h2>
            <span className="text-xs text-paper/50 flex items-center gap-1"><Clock size={12} /> ~{Math.ceil(questionCount / 6)} minutes</span>
          </div>
          
          <div className="flex gap-2 mb-3">
            {PRESET_COUNTS.map(count => (
              <button 
                key={count} 
                onClick={() => { setQuestionCount(count); setIsCustomCount(false); }}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition ${!isCustomCount && questionCount === count ? 'bg-accent text-white shadow-lg' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
              >
                {count}
              </button>
            ))}
            <button 
              onClick={() => setIsCustomCount(true)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition ${isCustomCount ? 'bg-accent text-white shadow-lg' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
            >
              Custom
            </button>
          </div>

          <AnimatePresence>
            {isCustomCount && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-3">
                <input 
                  type="number" 
                  min="5" 
                  max="500" 
                  value={customCountValue}
                  onChange={(e) => {
                    setCustomCountValue(e.target.value);
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 5) setQuestionCount(val);
                  }}
                  className="w-full bg-black/40 border border-accent/40 rounded-xl p-3 text-white text-center font-bold text-lg focus:outline-none focus:border-accent"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Repetition Warning */}
          {selectedSurahs.size > 0 && questionCount > totalSelectedVerses && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 flex gap-3 text-yellow-200/90 items-start">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <p className="text-xs">
                You selected {questionCount} questions but only have {totalSelectedVerses} verses available. Questions will repeat. Reduce count or add more Surahs to avoid repetition.
              </p>
            </motion.div>
          )}
        </section>

        {/* Advanced Settings */}
        <section>
          { }
          <button 
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            className="w-full flex items-center justify-between text-paper/80 font-bold p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition"
          >
            إعدادات متقدمة (Advanced)
            {showAdvancedSettings ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          <AnimatePresence>
            {showAdvancedSettings && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="p-4 bg-black/20 rounded-2xl mt-2 border border-white/5 space-y-6">
                  
                  {/* Difficulty */}
                  <div>
                    <label className="text-xs font-bold text-paper/50 uppercase tracking-widest block mb-2">Difficulty Tier</label>
                    <div className="flex flex-wrap gap-2">
                      {DIFFICULTY_TIERS.map(tier => (
                        <button 
                          key={tier}
                          onClick={() => setDifficulty(tier)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${difficulty === tier ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10'}`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question Types */}
                  <div>
                    <label className="text-xs font-bold text-paper/50 uppercase tracking-widest block mb-2 flex justify-between">
                      <span>Question Types</span>
                      <button 
                        onClick={() => setSelectedQuestionTypes(new Set(selectedQuestionTypes.size === ALL_QUESTION_TYPES.length ? [] : ALL_QUESTION_TYPES))} 
                        className="text-accent hover:underline"
                      >
                       {selectedQuestionTypes.size === ALL_QUESTION_TYPES.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </label>
                    <div className="flex flex-wrap gap-2" dir="ltr">
                      {ALL_QUESTION_TYPES.map(type => {
                        const isSelected = selectedQuestionTypes.has(type);
                        return (
                          <button 
                            key={type}
                            onClick={() => {
                              const newSet = new Set(selectedQuestionTypes);
                              if (newSet.has(type)) { 
                                if (Math.max(1, newSet.size) > 1) newSet.delete(type); 
                              } else {
                                newSet.add(type);
                              }
                              setSelectedQuestionTypes(newSet);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${isSelected ? 'bg-accent/20 text-accent border border-accent/40' : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10'}`}
                          >
                            {isSelected && <Check size={12} />} {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-gradient-to-t from-jungle-dark via-jungle-dark/95 to-transparent flex flex-col items-center pointer-events-none z-50">
        <div className="w-full max-w-xl flex flex-col items-center pointer-events-auto">
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2 flex items-center gap-2 mb-3 shadow-xl max-w-max mx-auto">
            <span className="font-bold text-accent">{questionCount} Qs</span>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="font-bold text-white/90">{selectedSurahs.size} Surahs</span>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="text-white/60 font-mono text-xs">~{Math.ceil(questionCount / 6)}m · {difficulty}</span>
          </div>

          { }
          <button 
            disabled={selectedSurahs.size === 0 || questionCount < 1}
            onClick={handleLaunch}
            className="w-full bg-accent hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-[0_10px_40px_rgba(217,119,6,0.3)] disabled:shadow-none flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer text-lg"
          >
            <Play size={20} className="fill-current" />
            ابدأ الجلسة · Start Session
          </button>
        </div>
      </div>

    </motion.div>
  );
};
