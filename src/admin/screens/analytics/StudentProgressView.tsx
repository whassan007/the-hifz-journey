import { useState, useMemo } from 'react';
import { Search, Filter, AlertTriangle, ChevronDown } from 'lucide-react';

interface MockStudent {
  id: string;
  name: string;
  className: string;
  surahsStarted: number;
  surahsMastered: number;
  currentSurah: string;
  retention: number;
  streak: number;
  isStuck: boolean;
  lastActive: string;
}

const MOCK_STUDENTS: MockStudent[] = [
  { id: '1', name: 'Yousef Ahmed', className: 'Advanced Hifz 2', surahsStarted: 14, surahsMastered: 11, currentSurah: 'Al-Mulk (67)', retention: 91, streak: 14, isStuck: false, lastActive: '2h ago' },
  { id: '2', name: 'Zaid Al-Ammar', className: 'Beginners (Riyadh)', surahsStarted: 3, surahsMastered: 2, currentSurah: 'An-Naba (78:14)', retention: 64, streak: 1, isStuck: true, lastActive: '1d ago' },
  { id: '3', name: 'Kareem T.', className: 'Advanced Hifz 2', surahsStarted: 12, surahsMastered: 10, currentSurah: 'Ar-Rahman (55)', retention: 88, streak: 5, isStuck: false, lastActive: '4h ago' },
  { id: '4', name: 'Mona Salih', className: 'Sisters Foundation', surahsStarted: 6, surahsMastered: 6, currentSurah: 'Al-Jinn (72:4)', retention: 55, streak: 0, isStuck: true, lastActive: '8d ago' },
];

export const StudentProgressView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filtered = useMemo(() => {
    return MOCK_STUDENTS.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.className.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Progress</h1>
          <p className="text-slate-500 mt-1">Track memorization status, retention rates, and identify stuck learners.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
             <Filter size={16} /> Filters
           </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search students or class names..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
             Showing {filtered.length} students
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Current Focus</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mastered</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Retention</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Streak</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(student => (
                <tr 
                  key={student.id} 
                  className={`group hover:bg-slate-50 transition-colors cursor-pointer ${student.isStuck ? 'bg-amber-50/30' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${student.isStuck ? 'text-amber-900' : 'text-slate-900'}`}>{student.name}</p>
                        <p className="text-xs text-slate-500">Active {student.lastActive}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                      {student.className}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">{student.currentSurah}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-600">
                       <span className="text-emerald-600 font-bold">{student.surahsMastered}</span> / {student.surahsStarted} surahs
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div 
                           className={`h-full ${student.retention > 80 ? 'bg-emerald-500' : typeof student.retention === 'number' && student.retention > 60 ? 'bg-amber-500' : 'bg-red-500'}`} 
                           style={{ width: `${student.retention}%` }} 
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-600">{student.retention}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-brand-600">{student.streak} days</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {student.isStuck ? (
                      <div className="group relative inline-flex">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 w-48 bg-slate-800 text-white text-xs font-medium p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                          This student has been struggling with the same verse for 7+ days.
                        </div>
                      </div>
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-300 group-hover:text-slate-500" />
                    )}
                  </td>
                </tr>
              ))}
              
              {filtered.length === 0 && (
                <tr>
                   <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium bg-slate-50">
                     No students found matching your criteria.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
