import { Leaf, Flame, Sparkles, Edit3, Check, Moon, Droplet, Map as MapIcon } from 'lucide-react';
import React from 'react';

export interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
}

export const BADGES: Badge[] = [
  { id: 'first_ayah', name: "First Ayah", desc: "Memorized your very first verse of the Quran.", icon: <Leaf className="text-emerald-400" /> },
  { id: 'al_fatiha_master', name: "Al-Fatiha Master", desc: "Completed all 7 verses of Surah Al-Fatiha.", icon: <Flame className="text-orange-400" /> },
  { id: 'juz_amma_complete', name: "Juz Amma Complete", desc: "Finished every surah in Juz 30.", icon: <Sparkles className="text-yellow-400" /> },
  { id: 'heart_of_the_quran', name: "Heart of the Quran", desc: "Memorized Surah Ya-Sin (Surah 36).", icon: <Edit3 className="text-blue-300" /> },
  { id: 'throne_verse', name: "Throne Verse", desc: "Memorized Ayat al-Kursi (Al-Baqarah 2:255) by heart.", icon: <Check className="text-emerald-400" /> },
  { id: 'the_last_three', name: "The Last Three", desc: "Memorized Al-Ikhlas, Al-Falaq, and An-Nas.", icon: <Moon className="text-purple-400" /> },
  { id: 'half_quran', name: "Half Quran", desc: "Reached the midpoint — 15 of 30 Juz memorized.", icon: <Droplet className="text-sky-300" /> },
  { id: 'full_hifz', name: "Full Hifz", desc: "الله أكبر — you have memorized the entire Quran.", icon: <MapIcon className="text-amber-500" /> },
  { id: 'three_in_a_row', name: "Three in a Row", desc: "Reviewed for 3 consecutive days.", icon: <Leaf className="text-emerald-400" /> },
  { id: 'week_warrior', name: "Week Warrior", desc: "7-day review streak.", icon: <Flame className="text-orange-400" /> },
  { id: 'fortnight_faithful', name: "Fortnight Faithful", desc: "14-day streak without a single missed day.", icon: <Sparkles className="text-yellow-400" /> },
  { id: 'month_of_dedication', name: "Month of Dedication", desc: "30 days of consistent daily review.", icon: <Edit3 className="text-blue-300" /> },
  { id: 'unbreakable', name: "Unbreakable", desc: "100-day streak — سبحان الله.", icon: <Check className="text-emerald-400" /> },
  { id: 'dawn_reciter', name: "Dawn Reciter", desc: "Completed a review before Fajr, 7 times.", icon: <Moon className="text-purple-400" /> },
  { id: 'night_reciter', name: "Night Reciter", desc: "Completed a review after Isha, 7 times.", icon: <Droplet className="text-sky-300" /> },
  { id: 'ramadan_runner', name: "Ramadan Runner", desc: "Maintained a daily streak through Ramadan.", icon: <MapIcon className="text-amber-500" /> },
  { id: 'perfect_session', name: "Perfect Session", desc: "100% accuracy in a complete review session.", icon: <Leaf className="text-emerald-400" /> },
  { id: 'speed_hafiz', name: "Speed Hafiz", desc: "Finished a review session in under 5 minutes with 90%+ accuracy.", icon: <Flame className="text-orange-400" /> },
  { id: 'retention_champion', name: "Retention Champion", desc: "Maintained 95%+ retention rate across 30 days.", icon: <Sparkles className="text-yellow-400" /> },
  { id: 'milestone__50_verses', name: "Milestone: 50 Verses", desc: "50 verses memorized and in active review.", icon: <Edit3 className="text-blue-300" /> },
  { id: 'milestone__100_verses', name: "Milestone: 100 Verses", desc: "100 verses in your active memory.", icon: <Check className="text-emerald-400" /> },
  { id: 'milestone__500_verses', name: "Milestone: 500 Verses", desc: "500 verses — you're building something remarkable.", icon: <Moon className="text-purple-400" /> },
  { id: 'milestone__1000_verses', name: "Milestone: 1000 Verses", desc: "1,000 verses memorized. A hafiz in the making.", icon: <Droplet className="text-sky-300" /> },
  { id: 'study_circle', name: "Study Circle", desc: "Joined a group Hifz challenge.", icon: <MapIcon className="text-amber-500" /> },
  { id: 'mentor', name: "Mentor", desc: "Supported another memorizer in their journey.", icon: <Leaf className="text-emerald-400" /> },
  { id: 'garden_unlocked', name: "Garden Unlocked", desc: "Completed Biome 1 — Garden of Beginnings.", icon: <Flame className="text-orange-400" /> },
  { id: 'summit_reached', name: "Summit Reached", desc: "Unlocked the final biome — Summit of Light.", icon: <Sparkles className="text-yellow-400" /> },
  { id: 'no_hints_needed', name: "No Hints Needed", desc: "Completed 10 consecutive sessions with zero hints.", icon: <Edit3 className="text-blue-300" /> },
  { id: 'verse_virtuoso', name: "Verse Virtuoso", desc: "Correctly answered 50 question-type challenges in a row.", icon: <Check className="text-emerald-400" /> },
  { id: 'tajweed_aware', name: "Tajweed Aware", desc: "Correctly identified 20 tajweed rules.", icon: <Moon className="text-purple-400" /> },
  { id: 'early_bird', name: "Early Bird", desc: "Reviewed before 7am on 10 separate days.", icon: <Droplet className="text-sky-300" /> },
  { id: 'patient_learner', name: "Patient Learner", desc: "Continued reviewing for 7 days after a broken streak.", icon: <MapIcon className="text-amber-500" /> },
];
