import { Users, GraduationCap, School, BookOpenCheck, TrendingUp, TrendingDown } from 'lucide-react';

const STATS = [
  { label: 'Students', value: '452', trend: '+12% this month', up: true, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Teachers', value: '38', trend: '+2% this month', up: true, icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-50' },
  { label: 'Active Classes', value: '112', trend: '-1% this month', up: false, icon: School, color: 'text-amber-500', bg: 'bg-amber-50' },
  { label: 'Verses Reviewed Today', value: '8,421', trend: '+24% vs yesterday', up: true, icon: BookOpenCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

export const DashboardView = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Platform overview and real-time statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            
            <p className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</p>
            <p className="text-sm font-medium text-slate-500 mb-4">{stat.label}</p>
            
            <div className={`mt-auto text-xs font-semibold flex items-center gap-1 ${stat.up ? 'text-emerald-600' : 'text-red-500'}`}>
              {stat.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2 min-h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Activity (Last 30 Days)</h3>
          
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50">
            <p className="text-slate-400 font-medium tracking-wide">Chart visualization pending analytics payload</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Top 5 Active Classes</h3>
            <div className="space-y-4">
               {/* Mock Top List */}
               <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                 <div>
                    <p className="text-sm font-bold text-slate-800">Advanced Year 2 (Riyadh)</p>
                    <p className="text-xs text-slate-500">Teacher: Ahmed Hassan</p>
                 </div>
                 <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-md">8,401 reviews</span>
               </div>
               
               <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                 <div>
                    <p className="text-sm font-bold text-slate-800">Beginners Hifz (London)</p>
                    <p className="text-xs text-slate-500">Teacher: Sarah M.</p>
                 </div>
                 <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-md">6,204 reviews</span>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Most Struggled Verses</h3>
            <div className="space-y-4">
               {/* Mock Verse Struggled List */}
               <div className="flex flex-col gap-1 pb-3 border-b border-slate-50">
                 <div className="flex justify-between w-full">
                    <p className="text-sm font-bold text-slate-800">Surah Al-Mulk (67), Verse 14</p>
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 flex items-center rounded-md">112 Stuck</span>
                 </div>
                 <p className="text-xs text-slate-500 text-right leading-relaxed font-arabic" dir="rtl">أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ اللَّطِيفُ الْخَبِيرُ</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
