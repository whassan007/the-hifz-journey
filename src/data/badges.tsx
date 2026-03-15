import { Leaf, Flame, Sparkles, Edit3, Check, Moon, Droplet, Map as MapIcon } from 'lucide-react';
import React from 'react';

export interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
}

export const BADGES: Badge[] = [
  { id: 'first_step', name: 'الخطوة الأولى', desc: 'أكمل السورة الأولى', icon: <Leaf className="text-statRank-start" /> },
  { id: 'consistent', name: 'مستمر', desc: 'سلسلة 3 أيام', icon: <Flame className="text-statStreak-start" /> },
  { id: 'devoted', name: 'مخلص', desc: 'سلسلة 7 أيام', icon: <Sparkles className="text-accent" /> },
  { id: 'young_scholar', name: 'طالب علم', desc: 'أكمل 5 سور', icon: <Edit3 className="text-blue-300" /> },
  { id: 'perfection', name: 'إتقان', desc: 'احصل على 100% في أي اختبار', icon: <Check className="text-emerald-400" /> },
  { id: 'master_tawhid', name: 'سيد التوحيد', desc: 'أكمل سورة الإخلاص', icon: <Moon className="text-statHikmah-start" /> },
  { id: 'lightning', name: 'صاعقة', desc: 'أجب في أقل من 3 ثوان', icon: <Droplet className="text-sky-300" /> },
  { id: 'explorer', name: 'مستكشف', desc: 'زر 3 مناطق', icon: <MapIcon className="text-statXp-start" /> },
];
