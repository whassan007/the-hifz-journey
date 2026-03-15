import UI from "../../../data/ui-text.json";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Users, BookOpen, Plus, MoreVertical, RefreshCw } from 'lucide-react';
import type { Class, ProgressSnapshot, ClassAssignment } from '../../../types';
import { SURAHS } from '../../../data/registry';
import { ClassCodeCard } from './ClassCodeCard';
interface ClassDetailProps {
  classData: Class;
  onBack: () => void;
}

// Mock Data
const MOCK_ROSTER: (ProgressSnapshot & {
  name: string;
})[] = [{
  studentId: 's1',
  name: 'Yusuf A.',
  classId: '1',
  versesMemorized: 450,
  retentionPct: 92,
  streak: 15,
  lastActive: '2h ago',
  updatedAt: ''
}, {
  studentId: 's2',
  name: 'Omar M.',
  classId: '1',
  versesMemorized: 310,
  retentionPct: 88,
  streak: 3,
  lastActive: '1d ago',
  updatedAt: ''
}, {
  studentId: 's3',
  name: 'Aisha F.',
  classId: '1',
  versesMemorized: 580,
  retentionPct: 96,
  streak: 42,
  lastActive: 'Just now',
  updatedAt: ''
}];
const MOCK_ASSIGNMENTS: ClassAssignment[] = [{
  id: 'a1',
  classId: '1',
  title: 'Weekend Review',
  surahRange: 'Al-Kahf (1-10)',
  dueDate: 'Sunday',
  createdByTeacherId: ''
}];
export const ClassDetailView = ({
  classData,
  onBack
}: ClassDetailProps) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'assignments'>('roster');
  const [isAddingAssignment, setIsAddingAssignment] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentSurah, setAssignmentSurah] = useState('');
  return <motion.div initial={{
    opacity: 0,
    x: 20
  }} animate={{
    opacity: 1,
    x: 0
  }} exit={{
    opacity: 0,
    x: -20
  }} className="w-full max-w-2xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
          <ArrowRight className="rotate-180" size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-paper mb-1">{classData.name}</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-paper/60">{MOCK_ROSTER.length} طلاب</span>
          </div>
        </div>
      </div>

      <ClassCodeCard classData={classData} />

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-black/20 p-1.5 rounded-2xl w-full">
        <button onClick={() => setActiveTab('roster')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'roster' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/60'}`}>
          <Users size={18} /> الطلاب
        </button>
        <button onClick={() => setActiveTab('assignments')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'assignments' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/60'}`}>
          <BookOpen size={18} /> الواجبات
        </button>
      </div>

      {/* Content - Roster */}
      {activeTab === 'roster' && <div className="flex flex-col gap-3">
          {MOCK_ROSTER.length === 0 ? <div className="text-center py-16 bg-black/20 rounded-3xl border border-white/5">
              <p className="text-paper/60">لا يوجد طلاب بعد. شارك الرمز الخاص بك للبدء.</p>
            </div> : <>
              {/* Roster Header Row */}
              <div className="grid grid-cols-12 px-4 py-2 text-xs font-bold text-paper/40 uppercase tracking-wider">
                <div className="col-span-5">الاسم</div>
                <div className="col-span-3 text-center">الآيات</div>
                <div className="col-span-2 text-center">% الحفظ</div>
                <div className="col-span-2 text-right">المواظبة</div>
              </div>

              {MOCK_ROSTER.map(s => <button key={s.studentId} className="grid grid-cols-12 items-center bg-black/40 border border-white/10 hover:border-white/30 transition-colors p-4 rounded-2xl text-left group">
                  <div className="col-span-5">
                    <p className="font-bold text-paper mb-0.5">{s.name}</p>
                    <p className="text-[10px] text-paper/40 flex items-center gap-1">
                      <RefreshCw size={10} /> {s.lastActive}
                    </p>
                  </div>
                  <div className="col-span-3 text-center font-bold text-statJungle-start">{s.versesMemorized}</div>
                  <div className="col-span-2 text-center font-bold text-statDesert-start">{s.retentionPct}%</div>
                  <div className="col-span-2 text-right font-bold flex justify-end items-center gap-1">
                    {s.streak} <span className="text-accent text-xs">🔥</span>
                  </div>
                </button>)}
            </>}
        </div>}

      {/* Content - Assignments */}
      {activeTab === 'assignments' && <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <button onClick={() => setIsAddingAssignment(true)} className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 text-sm transition-colors">
              <Plus size={16} /> إضافة واجب
            </button>
          </div>

          <AnimatePresence>
            {isAddingAssignment && <motion.div initial={{
          height: 0,
          opacity: 0
        }} animate={{
          height: 'auto',
          opacity: 1
        }} exit={{
          height: 0,
          opacity: 0
        }} className="overflow-hidden">
                <div className="bg-black/40 border border-white/10 p-5 rounded-2xl mb-4">
                  <input type="text" placeholder={UI.ui_70} value={assignmentTitle} onChange={e => setAssignmentTitle(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 mb-3 text-sm text-paper outline-none text-right" />
                  <select value={assignmentSurah} onChange={e => setAssignmentSurah(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 mb-4 text-sm text-paper outline-none text-right" dir="rtl">
                    <option value="">اختر السورة المستهدفة...</option>
                    {SURAHS.slice(0, 5).map(s => <option key={s.id} value={s.transliteration}>{s.transliteration} ({s.arabicName})</option>)}
                  </select>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setIsAddingAssignment(false)} className="px-4 py-2 text-xs font-bold text-white/50 hover:text-white">إلغاء</button>
                    <button onClick={() => setIsAddingAssignment(false)} className="px-4 py-2 bg-accent text-white rounded-lg text-xs font-bold">إرسال إلى الصف</button>
                  </div>
                </div>
              </motion.div>}
          </AnimatePresence>

          {MOCK_ASSIGNMENTS.length === 0 ? <div className="text-center py-16 bg-black/20 rounded-3xl border border-white/5">
              <p className="text-paper/60">لا توجد واجبات. اضغط على "إضافة واجب" لإنشاء واحد.</p>
            </div> : MOCK_ASSIGNMENTS.map(a => <div key={a.id} className="bg-black/30 border border-white/10 p-5 rounded-2xl flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-paper mb-1">{a.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-white/50">
                    <span className="flex items-center gap-1" dir="ltr"><BookOpen size={12} /> {a.surahRange}</span>
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-md">مستحق {a.dueDate}</span>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/40 transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>)}
        </div>}

    </motion.div>;
};