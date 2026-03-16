import { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SURAHS } from '../../../data/registry';

interface MockVerseDifficulty {
  id: string;
  surahName: string;
  verseNumber: number;
  arabicTextPreview: string;
  avgAccuracy: number;
  avgAttempts: number;
  studentsStuck: number;
  difficultyScore: number; // 0-100
  trend: 'up' | 'down' | 'flat';
}

const getMockVerses = (): MockVerseDifficulty[] => [
  { id: '1', surahName: 'Al-Mulk (67)', verseNumber: 14, arabicTextPreview: SURAHS.find(s=>s.id===67)?.verses[13] || '', avgAccuracy: 42, avgAttempts: 8.4, studentsStuck: 112, difficultyScore: 88, trend: 'up' },
  { id: '2', surahName: 'An-Naba (78)', verseNumber: 16, arabicTextPreview: SURAHS.find(s=>s.id===78)?.verses[15] || '', avgAccuracy: 58, avgAttempts: 5.1, studentsStuck: 45, difficultyScore: 72, trend: 'flat' },
  { id: '3', surahName: 'Al-Jinn (72)', verseNumber: 4,  arabicTextPreview: SURAHS.find(s=>s.id===72)?.verses[3] || '', avgAccuracy: 31, avgAttempts: 12.2, studentsStuck: 215, difficultyScore: 94, trend: 'up' },
  { id: '4', surahName: 'Al-Fatiha (1)', verseNumber: 2, arabicTextPreview: SURAHS.find(s=>s.id===1)?.verses[1] || '', avgAccuracy: 95, avgAttempts: 1.1, studentsStuck: 0, difficultyScore: 12, trend: 'down' },
];

export const VerseDifficultyView = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const sortedVerses = [...getMockVerses()].sort((a, b) => b.difficultyScore - a.difficultyScore);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Verse Difficulty Matrix</h1>
          <p className="text-slate-500 mt-1 max-w-2xl">
            Identifies systemic learning bottlenecks. Scores are weighted by accuracy (50%), attempt volume (30%), and stuck ratios (20%).
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by surah name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider w-16 text-center">Rank</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Surah & Verse</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right" dir="rtl">Preview</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Avg Accuracy</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Avg Attempts</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Students Stuck</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Score</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedVerses.map((verse, index) => (
                <tr key={verse.id} className="group hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-red-100 text-red-600' : 
                      index === 1 ? 'bg-orange-100 text-orange-600' :
                      index === 2 ? 'bg-amber-100 text-amber-600' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {index + 1}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{verse.surahName}</p>
                    <p className="text-xs text-slate-500">Ayah {verse.verseNumber}</p>
                  </td>

                  <td className="px-6 py-4 text-right">
                     <p className="text-sm font-arabic font-medium text-slate-700 leading-relaxed truncate max-w-xs ml-auto" dir="rtl">
                       {verse.arabicTextPreview}
                     </p>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold ${
                      verse.avgAccuracy < 50 ? 'bg-red-50 text-red-700' : 
                      verse.avgAccuracy < 75 ? 'bg-amber-50 text-amber-700' : 
                      'bg-emerald-50 text-emerald-700'
                    }`}>
                      {verse.avgAccuracy}%
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-slate-600">{verse.avgAttempts.toFixed(1)}</span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-bold ${verse.studentsStuck > 50 ? 'text-red-500' : 'text-slate-600'}`}>
                      {verse.studentsStuck}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="relative inline-flex items-center justify-center w-12 h-12">
                      {/* Radial Progress indicator */}
                      <svg className="w-12 h-12 -rotate-90">
                        <circle className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="transparent" r="20" cx="24" cy="24"/>
                        <circle 
                          className={verse.difficultyScore > 80 ? 'text-red-500' : verse.difficultyScore > 50 ? 'text-amber-500' : 'text-emerald-500'} 
                          strokeWidth="4" strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * verse.difficultyScore) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="20" cx="24" cy="24"
                        />
                      </svg>
                      <span className="absolute text-xs font-bold text-slate-700">{verse.difficultyScore}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center text-slate-400">
                     <div className="flex justify-center">
                        {verse.trend === 'up' && <TrendingUp className="w-5 h-5 text-red-500" />}
                        {verse.trend === 'down' && <TrendingDown className="w-5 h-5 text-emerald-500" />}
                        {verse.trend === 'flat' && <Minus className="w-5 h-5 text-slate-300" />}
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
