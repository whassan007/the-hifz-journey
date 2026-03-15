import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, ClipboardList, LogOut, ChevronRight, Hash } from 'lucide-react';
import type { UserState, Class } from '../../../types';
import { ClassDetailView } from './ClassDetailView';

interface TeacherDashboardProps {
  user: UserState;
  onLogout: () => void;
}

// Temporary Mock Data
const MOCK_CLASSES: Class[] = [
  {
    id: '1',
    name: 'مجموعة جزء عم',
    joinCode: 'class-fajr-east',
    teacherId: 'teacher-1',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'تحفيظ متقدم',
    joinCode: 'class-noor-seven',
    teacherId: 'teacher-1',
    createdAt: new Date().toISOString(),
    description: 'سورة البقرة'
  }
];

export const TeacherDashboardView = ({ user, onLogout }: TeacherDashboardProps) => {
  const [classes, setClasses] = useState<Class[]>(MOCK_CLASSES);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isCreatingClass, setIsCreatingClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDesc, setNewClassDesc] = useState('');

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    // Generate random code for prototype
    const words1 = ['fajr', 'noor', 'salam', 'badr', 'uhud', 'safaa'];
    const words2 = ['east', 'seven', 'star', 'moon', 'sky', 'path'];
    const w1 = words1[Math.floor(Math.random() * words1.length)];
    const w2 = words2[Math.floor(Math.random() * words2.length)];
    const code = `class-${w1}-${w2}`;

    const newClass: Class = {
      id: Date.now().toString(),
      name: newClassName,
      description: newClassDesc,
      joinCode: code,
      teacherId: 'teacher-1',
      createdAt: new Date().toISOString()
    };

    setClasses([newClass, ...classes]);
    setIsCreatingClass(false);
    setNewClassName('');
    setNewClassDesc('');
  };

  if (selectedClass) {
    return (
      <ClassDetailView 
        classData={selectedClass} 
        onBack={() => setSelectedClass(null)} 
      />
    );
  }

  return (
    <div className="w-full flex justify-center py-6 px-4">
      <div className="w-full max-w-2xl flex flex-col pt-8">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-paper mb-1">صفوفي</h1>
            <p className="text-paper/60 text-sm">مرحباً بعودتك، {user.name}</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsCreatingClass(true)}
              className="bg-accent hover:bg-amber-600 active:scale-95 transition-all text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 text-sm shadow-lg"
            >
              <Plus size={18} /> صف جديد
            </button>
            <button 
              onClick={onLogout}
              className="bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all text-white/80 font-bold p-2.5 rounded-xl flex items-center justify-center shadow-lg"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isCreatingClass && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-black/30 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
                <h3 className="text-lg font-bold text-paper mb-4">صف جديد</h3>
                <form onSubmit={handleCreateClass} className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="اسم الصف (مثال: مجموعة جزء عم)"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm font-medium text-paper outline-none focus:border-accent transition-colors"
                    autoFocus
                  />
                  <input
                    type="text"
                    placeholder="الوصف أو السورة المستهدفة (اختياري)"
                    value={newClassDesc}
                    onChange={(e) => setNewClassDesc(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm font-medium text-paper outline-none focus:border-accent transition-colors"
                  />
                  <div className="flex gap-3 justify-end mt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsCreatingClass(false)}
                      className="px-5 py-2.5 rounded-xl font-bold text-sm text-white/60 hover:text-white transition-colors"
                    >
                      إلغاء
                    </button>
                    <button 
                      type="submit"
                      disabled={!newClassName.trim()}
                      className="bg-accent disabled:opacity-50 disabled:bg-white/10 text-white font-bold py-2.5 px-6 rounded-xl transition-all"
                    >
                      إنشاء رمز الانضمام
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Classes List */}
        <div className="flex flex-col gap-4">
          {classes.length === 0 && !isCreatingClass && (
            <div className="text-center py-16 bg-black/20 rounded-3xl border border-white/5 border-dashed">
              <Users size={48} className="mx-auto text-white/20 mb-4" />
              <h3 className="text-lg font-bold text-paper/80 mb-2">لا توجد صفوف نشطة</h3>
              <p className="text-paper/50 text-sm">أنشئ صفاً لإنشاء رمز الانضمام.</p>
            </div>
          )}

          {classes.map((c) => (
             <motion.button 
               key={c.id}
               onClick={() => setSelectedClass(c)}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="w-full bg-black/40 border border-white/10 hover:border-white/30 transition-colors p-5 rounded-3xl backdrop-blur-md flex flex-col text-left group"
             >
                <div className="flex justify-between items-start w-full mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-paper mb-1">{c.name}</h3>
                    {c.description && <p className="text-paper/60 text-sm">{c.description}</p>}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-white text-white/40 transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-2 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm text-paper/80 bg-accent/20 text-accent px-3 py-1 rounded-lg">
                    <Hash size={14} />
                    <span className="font-mono font-bold">{c.joinCode}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-paper/60">
                    <Users size={16} />
                    <span>١٢ طالباً</span> {/* Mock value */}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-paper/60">
                    <ClipboardList size={16} />
                    <span dir="ltr">٨٤٪ متوسط الاحتفاظ</span> {/* Mock value */}
                  </div>
                </div>
             </motion.button>
          ))}
        </div>

      </div>
    </div>
  );
};
