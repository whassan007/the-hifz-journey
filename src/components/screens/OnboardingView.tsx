import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Check, ArrowRight } from 'lucide-react';
import type { AgeGroup } from '../../types';

interface OnboardingProps {
  onComplete: (name: string, ageGroup: AgeGroup) => void;
  onTeacherClick: () => void;
}

const AGE_GROUPS = [
  {
    id: 'seedling' as AgeGroup,
    name: 'برعم',
    ageRange: '٥–٩ سنوات',
    desc: 'صوتيات أولاً، ممتع، تدريبات مرنة.',
    color: 'bg-emerald-500',
    borderColor: 'border-emerald-500',
    lightBg: 'bg-emerald-500/10',
    defaults: { diff: 'مبتدئ', session: '١٠–١٥ دقيقة', types: '٤ (خيارات، صوت)' }
  },
  {
    id: 'sapling' as AgeGroup,
    name: 'نبتة',
    ageRange: '١٠–١٥ سنة',
    desc: 'تدريب منظم مع منافسة خفيفة.',
    color: 'bg-blue-500',
    borderColor: 'border-blue-500',
    lightBg: 'bg-blue-500/10',
    defaults: { diff: 'متوسط', session: '٢٠–٢٥ دقيقة', types: '٨ أنواع أساسية' }
  },
  {
    id: 'rising_tree' as AgeGroup,
    name: 'شجرة صاعدة',
    ageRange: '١٦–٢٥ سنة',
    desc: 'وصول كامل، تدريبات مكثفة.',
    color: 'bg-orange-500',
    borderColor: 'border-orange-500',
    lightBg: 'bg-orange-500/10',
    defaults: { diff: 'متقدم', session: '٣٠+ دقيقة', types: 'جميع الأنماط ١٥' }
  },
  {
    id: 'mighty_oak' as AgeGroup,
    name: 'بلوط شامخ',
    ageRange: '٢٦+ سنة',
    desc: 'مراجعة مرنة لأنماط الحياة المزدحمة.',
    color: 'bg-purple-500',
    borderColor: 'border-purple-500',
    lightBg: 'bg-purple-500/10',
    defaults: { diff: 'مرحلي', session: 'متغير', types: 'الكل + وضع المعلم' }
  }
];

export const OnboardingView = ({ onComplete, onTeacherClick }: OnboardingProps) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(null);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) setStep(2);
  };

  const selectedGroup = AGE_GROUPS.find(g => g.id === selectedAge);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 w-full max-w-md mx-auto relative z-10" dir="ltr">
      <AnimatePresence mode="wait">
        
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full shadow-2xl flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-6 border border-accent/40 shadow-[0_0_30px_rgba(217,119,6,0.3)]">
              <Leaf className="text-accent" size={40} />
            </div>
            
            <h1 className="text-2xl font-arabic font-black mb-2 text-paper text-center">بسم الله الرحمن الرحيم</h1>
            <p className="text-paper/60 text-center mb-8 text-sm mt-2">تبدأ رحلة حفظك بآية واحدة. سنوجهك خطوة بخطوة عبر كل آية من القرآن الكريم.</p>

            <form onSubmit={handleNameSubmit} className="w-full flex flex-col gap-4">
              <input
                type="text"
                placeholder="اسمك..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-xl font-bold text-paper outline-none focus:border-accent transition-colors text-center"
                autoFocus
              />
              <button 
                type="submit"
                disabled={!name.trim()}
                className="w-full bg-gradient-to-r from-accent to-orange-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg mt-2 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                الخطوة التالية <ArrowRight size={20} className="rotate-180" />
              </button>
            </form>
            <button 
              onClick={onTeacherClick}
              className="mt-6 text-sm font-bold text-accent/80 hover:text-accent transition-colors"
            >
              أنا معلم
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full flex flex-col"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between xl:mb-6 mb-4">
              <button onClick={() => setStep(1)} className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center hover:bg-teal-500/30 transition-colors">
                <ArrowRight size={20} className="rotate-180" />
              </button>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
              </div>
              <button onClick={() => onComplete(name, 'sapling')} className="text-sm font-medium text-white/50 hover:text-white">تخطي</button>
            </div>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-teal-500/40">
                <Leaf className="text-teal-400" size={24} />
              </div>
              <h2 className="text-xl font-bold text-paper mb-1">اختر الفئة العمرية</h2>
              <p className="text-[13px] text-paper/60">هذا يساعدنا على تخصيص تجربة الحفظ لك.</p>
            </div>

            <div className="flex flex-col gap-3 mb-4">
              {AGE_GROUPS.map((group) => {
                const isSelected = selectedAge === group.id;
                return (
                  <button
                    key={group.id}
                    onClick={() => setSelectedAge(group.id)}
                    className={`relative w-full text-left p-3 rounded-2xl border transition-all duration-200 flex items-center gap-4 ${isSelected ? `border-teal-500 bg-teal-500/5` : `border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10`}`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-inner ${group.color}`}>
                      {group.ageRange.split(' ')[1]}
                    </div>
                    <div className="flex-1 text-right">
                      <h3 className="text-[14px] font-medium text-paper leading-tight">{group.name}</h3>
                      <p className="text-[12px] text-paper/70">{group.ageRange}</p>
                      <p className="text-[11.5px] text-paper/40 mt-0.5 line-clamp-1">{group.desc}</p>
                    </div>
                    
                    {/* Radio Circle */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-teal-500 bg-teal-500' : 'border-white/20'}`}>
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {selectedGroup && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-black/40 border border-white/5 rounded-2xl p-4 mb-6 overflow-hidden"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-teal-400 mb-2 text-right">الإعدادات الافتراضية</p>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mt-2 font-mono text-right" dir="rtl">
                    <span className="text-white/50 text-left">الصعوبة:</span> <span className="text-right font-medium">{selectedGroup.defaults.diff}</span>
                    <span className="text-white/50 text-left">الجلسة:</span> <span className="text-right font-medium">{selectedGroup.defaults.session}</span>
                    <span className="text-white/50 text-left">الأسئلة:</span> <span className="text-right font-medium">{selectedGroup.defaults.types}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={() => selectedAge && onComplete(name, selectedAge)}
              disabled={!selectedAge}
              className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-white/10 disabled:text-white/30 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
            >
              متابعة
            </button>
            <p className="text-[11px] text-center text-white/40 mt-4 leading-relaxed px-4">
              يمكنك تغيير هذا في أي وقت من الإعدادات. مطلوب تحقق الوالدين للأعمار أقل من ١٦ عاماً.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
