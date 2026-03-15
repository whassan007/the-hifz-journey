import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Settings, Bookmark, X, Type, List, Monitor, Palette, Share2, Copy, BookOpen, Check } from 'lucide-react';
import type { UserState, Bookmark as BookmarkType, ReaderSpacing, ReaderDisplayMode, ReaderTheme } from '../../types';
import { SURAHS } from '../../data/registry';

interface SurahReaderViewProps {
  surahId: number;
  user: UserState;
  onUpdateUser: (updates: Partial<UserState>) => void;
  onBack: () => void;
  onNavigateSurah: (id: number) => void;
}

interface VerseData {
  number: number;
  text: string;
  numberInSurah: number;
}

export const SurahReaderView = ({ surahId, user, onUpdateUser, onBack, onNavigateSurah }: SurahReaderViewProps) => {
  const [verses, setVerses] = useState<VerseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);

  const surahData = SURAHS.find(s => s.id === surahId);

  const handleBookmark = (verseNumber: number, text: string) => {
    const existing = user.bookmarks?.find(b => b.surahId === surahId && b.ayahNumber === verseNumber);
    if (!existing) {
      const newBookmark: BookmarkType = {
        id: crypto.randomUUID(),
        surahId,
        ayahNumber: verseNumber,
        arabicText: text,
        note: null,
        createdAt: new Date().toISOString(),
        color: 'green'
      };
      onUpdateUser({ bookmarks: [...(user.bookmarks || []), newBookmark] });
    }
  };

  const handleRemoveBookmark = (verseNumber: number) => {
    const existing = user.bookmarks?.find(b => b.surahId === surahId && b.ayahNumber === verseNumber);
    if (existing) {
      onUpdateUser({ bookmarks: user.bookmarks.filter(b => b.id !== existing.id) });
      setSelectedVerse(null);
    }
  };

  const handleChangeBookmarkColor = (verseNumber: number, color: BookmarkType['color']) => {
    onUpdateUser({ 
      bookmarks: user.bookmarks.map(b => 
        (b.surahId === surahId && b.ayahNumber === verseNumber) ? { ...b, color } : b
      )
    });
  };

  const handleAddBookmarkNote = (verseNumber: number, note: string) => {
    onUpdateUser({ 
      bookmarks: user.bookmarks.map(b => 
        (b.surahId === surahId && b.ayahNumber === verseNumber) ? { ...b, note } : b
      )
    });
  };

  useEffect(() => {
    // Record that we opened this surah
    if (surahData && !user.readSurahs?.includes(surahId)) {
      onUpdateUser({ readSurahs: [...(user.readSurahs || []), surahId] });
    }

    const loadSurah = async () => {
      setLoading(true);
      setError(null);
      const cacheKey = `hifz_surah_text_${surahId}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        setVerses(JSON.parse(cached));
        setLoading(false);
        return;
      }

      if (!navigator.onLine) {
        setError("Connect to the internet once to download this surah for offline reading.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/quran-uthmani`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        const fetchedVerses = data.data.ayahs.map((ayah: any) => ({
          number: ayah.number,
          text: ayah.text,
          numberInSurah: ayah.numberInSurah
        }));

        localStorage.setItem(cacheKey, JSON.stringify(fetchedVerses));
        setVerses(fetchedVerses);
      } catch (err) {
        setError("Failed to load surah text. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    loadSurah();
  }, [surahId]);

  if (!surahData) return null;
  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-jungle-dark overflow-hidden">
      <header className="flex justify-between items-center p-4 bg-black/40 backdrop-blur-md border-b border-white/10 z-20">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowRight className="rotate-180" size={20} />
        </button>
        <div className="text-center flex-1">
          <h2 className="font-arabic text-xl font-bold">{surahData.arabicName}</h2>
          <p className="text-xs text-white/50">{surahData.transliteration}</p>
        </div>
        <div className="flex gap-2">
          <button className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${user.bookmarks?.some(b => b.surahId === surahId) ? 'bg-accent/20 text-accent' : 'bg-white/5 hover:bg-white/10'}`}>
            <Bookmark size={18} className={user.bookmarks?.some(b => b.surahId === surahId) ? "fill-current" : ""} />
          </button>
          <button onClick={() => setShowSettings(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-8 relative w-full max-w-3xl mx-auto">
        {loading ? (
          <div className="space-y-8 animate-pulse">
            <div className="h-20 bg-white/10 rounded-xl w-3/4 mx-auto" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-white/5 rounded-lg w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-amber-500 bg-amber-500/10 p-6 rounded-2xl border border-amber-500/20">
            <p className="font-bold">{error}</p>
            <button 
              onClick={() => onNavigateSurah(surahId)} 
              className="px-6 py-2 bg-amber-500/20 text-amber-500 rounded-full mt-4 font-bold"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6" dir="rtl">
            {/* Bismillah Header */}
            {surahData.bismillah && (
              <div className="w-full flex justify-center py-6 mb-4">
                <img src="/bismillah.svg" alt="Bismillah" className="h-14 opacity-90 invert-[0.8]" onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<h3 class="font-arabic text-3xl font-bold text-center">بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ</h3>';
                }} />
              </div>
            )}

            {verses.map((verse) => {
              let text = verse.text;
              if (surahId !== 1 && verse.numberInSurah === 1 && text.startsWith('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ')) {
                text = text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '');
              }

              const isBookmarked = user.bookmarks?.some(b => b.surahId === surahId && b.ayahNumber === verse.numberInSurah);
              const isSelected = selectedVerse === verse.numberInSurah;

              return (
                <div key={verse.number} className="relative w-full transition-colors">
                  <div 
                    onClick={() => setSelectedVerse(isSelected ? null : verse.numberInSurah)}
                    // Simulate long press for quick bookmarking using standard DOM events (desktop/mobile rough approximation)
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (!isBookmarked) handleBookmark(verse.numberInSurah, text);
                    }}
                    className={`relative p-4 rounded-xl cursor-pointer transition-colors select-text ${isSelected ? 'bg-white/5' : 'hover:bg-white/5'}`}
                  >
                    {isBookmarked && <div className="absolute right-0 top-0 bottom-0 w-1 bg-accent rounded-r-xl" />}
                    
                    <p 
                      className="font-arabic text-right text-paper"
                      style={{ 
                        fontSize: `${user.readerSettings.fontSize * 8 + 16}px`,
                        lineHeight: user.readerSettings.lineSpacing === 'compact' ? 1.8 : user.readerSettings.lineSpacing === 'wide' ? 3.0 : 2.5
                      }}
                    >
                      {text}
                      <span className="inline-flex items-center justify-center relative mx-2 text-accent/80 opacity-80" style={{ fontSize: `${user.readerSettings.fontSize * 6 + 10}px` }}>
                        <span className="absolute font-sans font-bold text-[0.4em]" style={{ top: '50%', transform: 'translateY(-50%)' }}>{verse.numberInSurah.toLocaleString('ar-EG')}</span>
                        ۝
                      </span>
                    </p>
                  </div>
                  
                  {/* Verse Action Menu */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        {isBookmarked ? (
                          <div className="flex flex-col gap-4 bg-black/40 border border-white/10 rounded-xl p-4 mx-4 mt-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-white/50">Bookmark color</span>
                              <div className="flex gap-3">
                                {['green', 'amber', 'blue', 'pink'].map(c => (
                                  <button 
                                    key={c}
                                    onClick={() => handleChangeBookmarkColor(verse.numberInSurah, c as any)}
                                    className={`w-6 h-6 rounded-full bg-${c}-500 ${user.bookmarks?.find(b => b.surahId === surahId && b.ayahNumber === verse.numberInSurah)?.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : 'opacity-70 hover:opacity-100'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <input 
                                type="text"
                                maxLength={280}
                                placeholder="Add a note about this verse…"
                                defaultValue={user.bookmarks?.find(b => b.surahId === surahId && b.ayahNumber === verse.numberInSurah)?.note || ''}
                                onBlur={(e) => handleAddBookmarkNote(verse.numberInSurah, e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent"
                              />
                            </div>
                            <div className="flex justify-end gap-2 text-xs font-bold mt-1">
                              <button 
                                onClick={() => handleRemoveBookmark(verse.numberInSurah)}
                                className="px-3 py-1.5 rounded-lg text-red-400 bg-red-400/10 hover:bg-red-400/20 transition-colors"
                              >
                                Remove bookmark
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex bg-black/40 border border-white/10 rounded-xl p-2 mx-4 mt-2 justify-around">
                            <button 
                              onClick={() => handleBookmark(verse.numberInSurah, text)}
                              className="flex flex-col items-center gap-1 p-2 text-white/70 hover:text-accent transition-colors"
                            >
                              <Bookmark size={18} />
                              <span className="text-[10px] font-bold">Save verse</span>
                            </button>
                            <button 
                              onClick={() => navigator.clipboard.writeText(text)}
                              className="flex flex-col items-center gap-1 p-2 text-white/70 hover:text-white transition-colors"
                            >
                              <Copy size={18} />
                              <span className="text-[10px] font-bold">Copy</span>
                            </button>
                            <button className="flex flex-col items-center gap-1 p-2 text-white/70 hover:text-white transition-colors">
                              <Share2 size={18} />
                              <span className="text-[10px] font-bold">Share</span>
                            </button>
                            <button className="flex flex-col items-center gap-1 p-2 text-white/30 cursor-not-allowed">
                              <BookOpen size={18} />
                              <span className="text-[10px] font-bold">Tafsir · coming soon</span>
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <footer className="bg-black/40 backdrop-blur-md border-t border-white/10 p-4 shrink-0 z-20">
        <div className="max-w-3xl mx-auto flex justify-between items-center text-sm font-bold text-white/50">
          <button 
            disabled={surahId === 114}
            onClick={() => surahId < 114 && onNavigateSurah(surahId + 1)}
            className="hover:text-accent disabled:opacity-30 p-2"
          >
            {surahId < 114 ? SURAHS.find(s => s.id === surahId + 1)?.arabicName : ''} &lt;
          </button>
          
          <span>Surah {surahId} of 114</span>
          
          <button 
            disabled={surahId === 1}
            onClick={() => surahId > 1 && onNavigateSurah(surahId - 1)}
            className="hover:text-accent disabled:opacity-30 p-2"
          >
            &gt; {surahId > 1 ? SURAHS.find(s => s.id === surahId - 1)?.arabicName : ''}
          </button>
        </div>
      </footer>

      {/* Reader Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-4 text-white" dir="ltr">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm bg-jungle-dark border border-white/10 p-6 rounded-[2rem] rounded-b-xl shadow-2xl flex flex-col gap-6"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-xl">Reader settings</h3>
                <button onClick={() => setShowSettings(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Font Size */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-white/50 font-bold uppercase tracking-wider">
                  <Type size={16} /> Text size
                </div>
                <div className="flex items-center gap-4 bg-black/40 p-2 rounded-xl border border-white/5">
                  <button 
                    onClick={() => user.readerSettings.fontSize > 1 && onUpdateUser({ readerSettings: { ...user.readerSettings, fontSize: user.readerSettings.fontSize - 1 } })}
                    className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white/10 text-xl font-bold transition-colors"
                  >A-</button>
                  <div className="flex-1 flex justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map(v => (
                      <div key={v} className={`h-2.5 rounded-full transition-all ${user.readerSettings.fontSize >= v ? 'bg-accent w-4' : 'bg-white/20 w-2.5'}`} />
                    ))}
                  </div>
                  <button 
                    onClick={() => user.readerSettings.fontSize < 5 && onUpdateUser({ readerSettings: { ...user.readerSettings, fontSize: user.readerSettings.fontSize + 1 } })}
                    className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white/10 text-xl font-bold transition-colors"
                  >A+</button>
                </div>
              </div>

              {/* Line Spacing */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-white/50 font-bold uppercase tracking-wider">
                  <List size={16} /> Spacing
                </div>
                <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/5 font-bold text-sm">
                  {['compact', 'normal', 'wide'].map(s => (
                    <button 
                      key={s}
                      onClick={() => onUpdateUser({ readerSettings: { ...user.readerSettings, lineSpacing: s as ReaderSpacing } })}
                      className={`flex-1 py-3 text-center rounded-lg capitalize transition-colors ${user.readerSettings.lineSpacing === s ? 'bg-accent text-white shadow-md' : 'text-white/50 hover:text-white'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Mode */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-white/50 font-bold uppercase tracking-wider">
                  <Monitor size={16} /> Show
                </div>
                <div className="grid grid-cols-1 gap-1 bg-black/40 p-1.5 rounded-xl border border-white/5 font-bold text-sm">
                  {[
                    { id: 'arabic_only', label: 'Arabic only' },
                    { id: 'arabic_transliteration', label: 'With transliteration' },
                    { id: 'arabic_translation', label: 'With translation' }
                  ].map(m => (
                    <button 
                      key={m.id}
                      onClick={() => onUpdateUser({ readerSettings: { ...user.readerSettings, displayMode: m.id as ReaderDisplayMode } })}
                      className={`w-full py-3 px-4 text-left rounded-lg transition-colors flex justify-between items-center ${user.readerSettings.displayMode === m.id ? 'bg-accent text-white shadow-md' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
                    >
                      <span>{m.label}</span>
                      {user.readerSettings.displayMode === m.id && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-white/50 font-bold uppercase tracking-wider">
                  <Palette size={16} /> Theme
                </div>
                <div className="grid grid-cols-2 gap-2 font-bold text-sm">
                  {[
                    { id: 'match_app', label: 'Match app', classes: 'bg-jungle border-white/20 text-white' },
                    { id: 'dark', label: 'Dark', classes: 'bg-slate-900 border-slate-700 text-white' },
                    { id: 'light', label: 'Light', classes: 'bg-white border-slate-200 text-slate-800' },
                    { id: 'sepia', label: 'Sepia', classes: 'bg-[#f4ecd8] border-[#e2d6b3] text-[#704214]' }
                  ].map(t => (
                    <button 
                      key={t.id}
                      onClick={() => onUpdateUser({ readerSettings: { ...user.readerSettings, theme: t.id as ReaderTheme } })}
                      className={`py-3 px-4 rounded-xl border-2 transition-all flex justify-between items-center ${t.classes} ${user.readerSettings.theme === t.id ? 'border-accent ring-2 ring-accent/20' : 'opacity-70 hover:opacity-100'}`}
                    >
                      <span>{t.label}</span>
                      {user.readerSettings.theme === t.id && <div className="w-2 h-2 rounded-full bg-current" />}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
