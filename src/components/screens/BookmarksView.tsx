import { useState } from 'react';
import { ArrowRight, Trash2, Bookmark as BookmarkIcon, Edit3 } from 'lucide-react';
import type { UserState, Bookmark, Highlight } from '../../types';
import { SURAHS } from '../../data/registry';

interface BookmarksViewProps {
  user: UserState;
  onUpdateUser: (updates: Partial<UserState>) => void;
  onBack: () => void;
  onNavigateSurah: (id: number) => void;
}

export const BookmarksView = ({ user, onUpdateUser, onBack, onNavigateSurah }: BookmarksViewProps) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'highlights'>('bookmarks');
  const [colorFilter, setColorFilter] = useState<'all' | 'green' | 'amber' | 'blue' | 'pink' | 'yellow'>('all');

  const bookmarks = user.bookmarks || [];
  const highlights = user.highlights || [];

  const filteredBookmarks = colorFilter === 'all' ? bookmarks : bookmarks.filter(b => b.color === colorFilter);
  const filteredHighlights = colorFilter === 'all' ? highlights : highlights.filter(h => h.color === colorFilter);

  // Group by surah
  const groupedBookmarks = filteredBookmarks.reduce((acc, current) => {
    if (!acc[current.surahId]) acc[current.surahId] = [];
    acc[current.surahId].push(current);
    return acc;
  }, {} as Record<number, Bookmark[]>);

  const groupedHighlights = filteredHighlights.reduce((acc, current) => {
    if (!acc[current.surahId]) acc[current.surahId] = [];
    acc[current.surahId].push(current);
    return acc;
  }, {} as Record<number, Highlight[]>);

  const handleDeleteBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this bookmark?')) {
      onUpdateUser({ bookmarks: user.bookmarks.filter(b => b.id !== id) });
    }
  };

  const handleDeleteHighlight = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this highlight?')) {
      onUpdateUser({ highlights: user.highlights.filter(h => h.id !== id) });
    }
  };

  const hasContent = activeTab === 'bookmarks' ? bookmarks.length > 0 : highlights.length > 0;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-jungle text-white overflow-hidden">
      <div className="flex flex-col pt-4 pb-2 px-4 bg-jungle-dark/80 backdrop-blur-md border-b border-white/10 shrink-0">
        <div className="flex justify-between items-center mb-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowRight className="rotate-180" size={20} />
          </button>
          <div className="text-center">
            <h2 className="font-bold text-xl">Saved</h2>
          </div>
          <div className="w-10 h-10" />
        </div>

        {/* Tabs */}
        <div className="flex bg-black/40 p-1 rounded-xl mb-4 max-w-sm mx-auto w-full">
          <button 
            onClick={() => { setActiveTab('bookmarks'); setColorFilter('all'); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'bookmarks' ? 'bg-white/10 text-white shadow-sm' : 'text-white/50 hover:text-white'}`}
          >
            <BookmarkIcon size={16} /> Bookmarks
          </button>
          <button 
            onClick={() => { setActiveTab('highlights'); setColorFilter('all'); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'highlights' ? 'bg-white/10 text-white shadow-sm' : 'text-white/50 hover:text-white'}`}
          >
            <Edit3 size={16} /> Highlights
          </button>
        </div>

        {/* Filters */}
        {hasContent && (
          <div className="flex justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button 
              onClick={() => setColorFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${colorFilter === 'all' ? 'bg-white text-black border-white' : 'bg-transparent text-white border-white/20'}`}
            >
              All
            </button>
            {(activeTab === 'bookmarks' ? ['green', 'amber', 'blue', 'pink'] : ['yellow', 'green', 'blue', 'pink']).map((c) => (
              <button 
                key={c}
                onClick={() => setColorFilter(c as 'all' | 'green' | 'amber' | 'blue' | 'pink' | 'yellow')}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold transition-colors border ${colorFilter === c ? 'bg-white/20 border-white/50' : 'bg-transparent border-white/20'}`}
              >
                <div className={`w-2.5 h-2.5 rounded-full bg-${c}-500`} />
                <span className="capitalize">{c}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 w-full max-w-2xl mx-auto">
        {!hasContent ? (
          <div className="flex flex-col items-center justify-center h-full text-white/50 text-center gap-4 mt-20">
            {activeTab === 'bookmarks' ? <BookmarkIcon size={48} className="opacity-20" /> : <Edit3 size={48} className="opacity-20" />}
            <p className="max-w-xs leading-relaxed">
              {activeTab === 'bookmarks' 
                ? "No bookmarks yet. Tap the save icon while reading a Surah to bookmark a verse."
                : "No highlights yet. Long-press any word while reading to mark it."}
            </p>
          </div>
        ) : activeTab === 'bookmarks' ? (
          <div className="space-y-6 max-w-2xl mx-auto pb-20">
            {Object.keys(groupedBookmarks).map(surahId => {
              const surah = SURAHS.find(s => s.id === Number(surahId));
              if (!surah) return null;
              return (
                <div key={surahId} className="bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
                  <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex justify-between items-center">
                    <div>
                      <h3 className="font-arabic font-bold text-lg">{surah.arabicName}</h3>
                      <p className="text-xs text-white/50">{surah.transliteration}</p>
                    </div>
                    <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded-full">{groupedBookmarks[Number(surahId)].length} saved</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {groupedBookmarks[Number(surahId)].sort((a,b) => a.ayahNumber - b.ayahNumber).map((bookmark, i) => (
                      <div 
                        key={bookmark.id} 
                        onClick={() => onNavigateSurah(Number(surahId))}
                        className={`p-4 hover:bg-white/5 transition-colors cursor-pointer group flex flex-col gap-3 relative ${i !== groupedBookmarks[Number(surahId)].length - 1 ? 'border-b border-white/5' : ''}`}
                      >
                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${bookmark.color}-500`} />
                        <div className="flex justify-between items-start pl-2 gap-4">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded text-${bookmark.color}-400 bg-${bookmark.color}-400/20`}>
                            Verse {bookmark.ayahNumber}
                          </span>
                          <button 
                            onClick={(e) => handleDeleteBookmark(bookmark.id, e)}
                            className="p-1.5 text-white/30 hover:text-red-400 hover:bg-white/5 rounded transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="font-arabic text-right text-lg leading-loose pl-2">{bookmark.arabicText}</p>
                        {bookmark.note && (
                          <div className="mt-2 ml-2 text-sm text-white/70 bg-black/40 p-3 rounded-lg border-l-2" style={{ borderLeftColor: `var(--tw-colors-${bookmark.color}-500)` }}>
                            {bookmark.note}
                          </div>
                        )}
                        <div className="flex items-center gap-2 pl-2 mt-2">
                          <span className="text-xs text-white/40">{new Date(bookmark.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-6 max-w-2xl mx-auto pb-20">
            {Object.keys(groupedHighlights).map(surahId => {
              const surah = SURAHS.find(s => s.id === Number(surahId));
              if (!surah) return null;
              return (
                <div key={surahId} className="bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
                  <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex justify-between items-center">
                    <div>
                      <h3 className="font-arabic font-bold text-lg">{surah.arabicName}</h3>
                      <p className="text-xs text-white/50">{surah.transliteration}</p>
                    </div>
                    <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded-full">{groupedHighlights[Number(surahId)].length} saved</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {groupedHighlights[Number(surahId)].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(highlight => (
                      <div 
                        key={highlight.id} 
                        onClick={() => onNavigateSurah(Number(surahId))}
                        className="p-4 hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-2 gap-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full bg-${highlight.color}-500`} />
                            <span className="text-xs font-bold text-white/50">Verse {highlight.ayahNumber}</span>
                          </div>
                          <button 
                            onClick={(e) => handleDeleteHighlight(highlight.id, e)}
                            className="p-1.5 text-white/30 hover:text-red-400 hover:bg-white/5 rounded transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="font-arabic text-right text-lg leading-loose" dir="rtl">
                          «{highlight.selectedText}»
                        </p>
                        {highlight.note && (
                          <div className="mt-3 text-sm text-white/70 bg-black/40 p-3 rounded-lg border-l-2" style={{ borderLeftColor: `var(--tw-colors-${highlight.color}-500)` }}>
                            {highlight.note}
                          </div>
                        )}
                        <div className="mt-3 text-xs text-white/40">
                          {new Date(highlight.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="pb-12" />
      </div>
    </div>
  );
};
