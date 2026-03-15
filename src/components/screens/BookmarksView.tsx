import { useState } from 'react';
import { ArrowRight, Trash2 } from 'lucide-react';
import type { UserState, Bookmark } from '../../types';
import { SURAHS } from '../../data/registry';

interface BookmarksViewProps {
  user: UserState;
  onUpdateUser: (updates: Partial<UserState>) => void;
  onBack: () => void;
  onReadSurah: (id: number) => void;
}

export const BookmarksView = ({ user, onUpdateUser, onBack, onReadSurah }: BookmarksViewProps) => {
  const [filter, setFilter] = useState<'all' | Bookmark['color']>('all');

  const filteredBookmarks = (user.bookmarks || []).filter(b => filter === 'all' || b.color === filter);
  
  // Group by Surah
  const grouped = filteredBookmarks.reduce((acc, bookmark) => {
    if (!acc[bookmark.surahId]) acc[bookmark.surahId] = [];
    acc[bookmark.surahId].push(bookmark);
    return acc;
  }, {} as Record<number, Bookmark[]>);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Remove this bookmark?')) {
      onUpdateUser({ bookmarks: user.bookmarks.filter(b => b.id !== id) });
    }
  };

  const colors = [
    { id: 'all', label: 'All', bg: 'bg-white/10' },
    { id: 'green', label: 'Green', bg: 'bg-green-500' },
    { id: 'amber', label: 'Amber', bg: 'bg-amber-500' },
    { id: 'blue', label: 'Blue', bg: 'bg-blue-500' },
    { id: 'pink', label: 'Pink', bg: 'bg-pink-500' },
  ];

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-jungle text-white overflow-hidden">
      <header className="flex px-6 py-4 items-center gap-4 bg-black/40 backdrop-blur-md border-b border-white/10">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowRight className="rotate-180" size={20} />
        </button>
        <h1 className="text-xl font-bold text-paper">إشاراتي · My Bookmarks</h1>
      </header>
      
      <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
        {colors.map(c => (
          <button 
            key={c.id} 
            onClick={() => setFilter(c.id as any)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border-2 ${filter === c.id ? 'border-white bg-white/20' : 'border-transparent bg-black/30 text-white/60 hover:text-white'}`}
          >
            <div className="flex items-center gap-2">
              {c.id !== 'all' && <div className={`w-2.5 h-2.5 rounded-full ${c.bg}`} />}
              {c.label}
            </div>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 w-full max-w-2xl mx-auto">
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-20 text-paper/50 px-8 bg-black/20 rounded-3xl border border-white/5 mt-8">
            <p className="font-bold text-lg mb-2">No bookmarks yet</p>
            <p className="text-sm text-balance">Long-press any verse while reading to save it here.</p>
          </div>
        ) : (
          Object.keys(grouped).sort((a,b) => Number(a) - Number(b)).map(surahIdStr => {
            const surahId = Number(surahIdStr);
            const surah = SURAHS.find(s => s.id === surahId);
            const bookmarks = grouped[surahId].sort((a,b) => a.ayahNumber - b.ayahNumber);
            if (!surah) return null;

            return (
              <div key={surahId} className="bg-black/30 rounded-2xl border border-white/10 overflow-hidden">
                <div className="bg-black/50 px-4 py-3 border-b border-white/5 flex justify-between items-center" dir="rtl">
                  <h3 className="font-arabic font-bold text-lg text-paper">{surah.arabicName}</h3>
                  <span className="text-xs text-white/50">{surah.transliteration}</span>
                </div>
                
                <div className="flex flex-col">
                  {bookmarks.map((b, i) => (
                    <div 
                      key={b.id} 
                      onClick={() => onReadSurah(surahId)}
                      className={`relative p-4 flex flex-col gap-3 cursor-pointer hover:bg-white/5 transition-colors ${i !== bookmarks.length - 1 ? 'border-b border-white/5' : ''}`}
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${b.color}-500`} />
                      
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-xs font-bold text-white/50 shrink-0">Verse {b.ayahNumber}</span>
                        <p className="font-arabic text-right text-lg/loose flex-1" dir="rtl">{b.arabicText}</p>
                      </div>

                      <div className="flex justify-between items-end mt-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full bg-${b.color}-500`} />
                          <span className="text-xs text-white/40">{new Date(b.createdAt).toLocaleDateString()}</span>
                        </div>
                        <button 
                          onClick={(e) => handleDelete(b.id, e)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
        <div className="pb-12" />
      </div>
    </div>
  );
};
