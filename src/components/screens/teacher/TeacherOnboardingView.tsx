import UI from "../../../data/ui-text.json";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ArrowRight, School, User } from 'lucide-react';
interface TeacherOnboardingProps {
  onComplete: (name: string, email: string, organization: string) => void;
  onBackToStudent: () => void;
}
export const TeacherOnboardingView = ({
  onComplete,
  onBackToStudent
}: TeacherOnboardingProps) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const canProceedStep1 = name.trim() && email.trim() && password.trim() && password === confirmPassword;
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canProceedStep1) setStep(2);
  };
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };
  return <div className="flex flex-col items-center justify-center min-h-screen p-6 w-full max-w-md mx-auto relative z-10" dir="ltr">
      <AnimatePresence mode="wait">
        
        {step === 1 && <motion.div key="step1" initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} exit={{
        opacity: 0,
        x: -50
      }} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full shadow-2xl flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center border border-accent/40 shadow-inner">
                <User className="text-accent" size={24} />
              </div>
              <button onClick={onBackToStudent} className="text-xs font-bold text-white/40 hover:text-white transition-colors">
                العودة لحساب طالب
              </button>
            </div>
            
            <h1 className="text-2xl font-black mb-2 text-paper">إنشاء حساب معلم</h1>
            <p className="text-paper/60 text-sm mb-6">إدارة الصفوف، تحديد الواجبات، ومتابعة تقدم الحفظ لدى طلابك.</p>

            <form onSubmit={handleStep1Submit} className="w-full flex flex-col gap-3">
              <input type="text" placeholder={UI.ui_80} value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm font-medium text-paper outline-none focus:border-accent transition-colors text-right" autoFocus required />
              <input type="email" placeholder={UI.ui_79} value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm font-medium text-paper outline-none focus:border-accent transition-colors text-right" required />
              <input type="password" placeholder={UI.ui_78} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm font-medium text-paper outline-none focus:border-accent transition-colors text-right" required />
              <input type="password" placeholder={UI.ui_77} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm font-medium text-paper outline-none focus:border-accent transition-colors text-right" required />
              <button type="submit" disabled={!canProceedStep1} className="w-full bg-accent hover:bg-amber-600 disabled:opacity-50 disabled:bg-white/10 text-white font-bold py-3.5 rounded-xl shadow-lg mt-4 transition-all active:scale-95 text-sm">
                إنشاء حساب المعلم
              </button>
            </form>
          </motion.div>}

        {step === 2 && <motion.div key="step2" initial={{
        opacity: 0,
        x: 50
      }} animate={{
        opacity: 1,
        x: 0
      }} exit={{
        opacity: 0,
        x: -50
      }} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setStep(1)} className="w-10 h-10 rounded-full bg-white/5 text-white/60 flex items-center justify-center hover:bg-white/10 transition-colors">
                <ArrowRight size={20} className="rotate-180" />
              </button>
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/40 shadow-inner">
                <School className="text-blue-400" size={24} />
              </div>
            </div>

            <h1 className="text-2xl font-black mb-2 text-paper">مؤسستك <span className="text-white/40 font-medium text-lg">(اختياري)</span></h1>
            <p className="text-paper/60 text-sm mb-6">أين ستقوم بالتدريس؟ هذا يساعد الطلاب على التعرف على صفوفك.</p>

            <form onSubmit={handleStep2Submit} className="w-full flex flex-col gap-4">
              <input type="text" placeholder={UI.ui_76} value={organization} onChange={e => setOrganization(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm font-medium text-paper outline-none focus:border-blue-500 transition-colors text-right" autoFocus />
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg mt-2 transition-all active:scale-95 text-sm">
                متابعة
              </button>
            </form>
          </motion.div>}

        {step === 3 && <motion.div key="step3" initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full shadow-2xl flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <Leaf className="text-emerald-400" size={40} />
            </div>
            
            <h1 className="text-2xl font-black mb-3 text-paper">جاهز يا أستاذ</h1>
            <p className="text-paper/80 text-sm mb-8 leading-relaxed">
              حسابك جاهز. قم بإنشاء صفك الأول لمشاركة رمز الانضمام مع طلابك.
            </p>

            <button onClick={() => onComplete(name, email, organization)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95">
              إنشاء صف
            </button>
          </motion.div>}

      </AnimatePresence>
    </div>;
};