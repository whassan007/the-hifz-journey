import UI from "../data/ui-text.json";
import { Trophy, Flame, Map as MapIcon, Star, Check, Zap, Globe, BookOpen, Leaf, Sparkles, Edit3, Moon, Droplet } from 'lucide-react';
import React from 'react';
export interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
}
export const BADGES: Badge[] = [{
  id: 'first_ayah',
  name: "First Ayah",
  desc: "Memorized your very first verse of the Quran.",
  icon: <BookOpen className="text-indigo-400" />
}, {
  id: 'al_fatiha_master',
  name: "Al-Fatiha Master",
  desc: "Completed all 7 verses of Surah Al-Fatiha.",
  icon: <Flame className="text-orange-400" />
}, {
  id: 'juz_amma_complete',
  name: "Juz Amma Complete",
  desc: "Finished every surah in Juz 30.",
  icon: <Star className="text-yellow-400 fill-current" />
}, {
  id: 'heart_of_the_quran',
  name: "Heart of the Quran",
  desc: "Memorized Surah Ya-Sin (Surah 36).",
  icon: <Trophy className="text-emerald-500" />
}, {
  id: 'throne_verse',
  name: "Throne Verse",
  desc: "Memorized Ayat al-Kursi (Al-Baqarah 2:255) by heart.",
  icon: <Check className="text-emerald-400" />
}, {
  id: 'the_last_three',
  name: "The Last Three",
  desc: "Memorized Al-Ikhlas, Al-Falaq, and An-Nas.",
  icon: <BookOpen className="text-indigo-400" />
}, {
  id: 'half_quran',
  name: "Half Quran",
  desc: "Reached the midpoint — 15 of 30 Juz memorized.",
  icon: <Globe className="text-blue-400" />
}, {
  id: 'full_hifz',
  name: "Full Hifz",
  desc: UI.ui_82,
  icon: <MapIcon className="text-amber-500" />
}, {
  id: 'devoted',
  name: "Devoted",
  desc: "7-day streak",
  icon: <Flame className="text-red-500" />
}, {
  id: 'young_scholar',
  name: "Young Scholar",
  desc: "Complete 5 Surahs",
  icon: <BookOpen className="text-indigo-400" />
}, {
  id: 'perfection',
  name: "Perfection",
  desc: "Score 100% on any quiz",
  icon: <Star className="text-yellow-400 fill-current" />
}, {
  id: 'master_tawhid',
  name: "Master of Tawhid",
  desc: "Complete Al-Ikhlas",
  icon: <Trophy className="text-emerald-500" />
}, {
  id: 'lightning',
  name: "Lightning",
  desc: "Answer in under 3 seconds",
  icon: <Zap className="text-yellow-300 fill-current" />
}, {
  id: 'unbreakable',
  name: "Unbreakable",
  desc: UI.ui_81,
  icon: <Check className="text-emerald-400" />
}, {
  id: 'explorer',
  name: "Explorer",
  desc: "Visit 3 biomes",
  icon: <Globe className="text-blue-400" />
}, {
  id: 'dawn_reciter',
  name: "Dawn Reciter",
  desc: "Completed a review before Fajr, 7 times.",
  icon: <BookOpen className="text-indigo-400" />
}, {
  id: 'night_reciter',
  name: "Night Reciter",
  desc: "Completed a review after Isha, 7 times.",
  icon: <Globe className="text-blue-400" />
}, {
  id: 'ramadan_runner',
  name: "Ramadan Runner",
  desc: "Maintained a daily streak through Ramadan.",
  icon: <MapIcon className="text-amber-500" />
}, {
  id: 'perfect_session',
  name: "Perfect Session",
  desc: "100% accuracy in a complete review session.",
  icon: <Leaf className="text-emerald-400" />
}, {
  id: 'speed_hafiz',
  name: "Speed Hafiz",
  desc: "Finished a review session in under 5 minutes with 90%+ accuracy.",
  icon: <Flame className="text-orange-400" />
}, {
  id: 'retention_champion',
  name: "Retention Champion",
  desc: "Maintained 95%+ retention rate across 30 days.",
  icon: <Sparkles className="text-yellow-400" />
}, {
  id: 'milestone__50_verses',
  name: "Milestone: 50 Verses",
  desc: "50 verses memorized and in active review.",
  icon: <Edit3 className="text-blue-300" />
}, {
  id: 'milestone__100_verses',
  name: "Milestone: 100 Verses",
  desc: "100 verses in your active memory.",
  icon: <Check className="text-emerald-400" />
}, {
  id: 'milestone__500_verses',
  name: "Milestone: 500 Verses",
  desc: "500 verses — you're building something remarkable.",
  icon: <Moon className="text-purple-400" />
}, {
  id: 'milestone__1000_verses',
  name: "Milestone: 1000 Verses",
  desc: "1,000 verses memorized. A hafiz in the making.",
  icon: <Droplet className="text-sky-300" />
}, {
  id: 'study_circle',
  name: "Study Circle",
  desc: "Joined a group Hifz challenge.",
  icon: <MapIcon className="text-amber-500" />
}, {
  id: 'mentor',
  name: "Mentor",
  desc: "Supported another memorizer in their journey.",
  icon: <Leaf className="text-emerald-400" />
}, {
  id: 'garden_unlocked',
  name: "Garden Unlocked",
  desc: "Completed Biome 1 — Garden of Beginnings.",
  icon: <Flame className="text-orange-400" />
}, {
  id: 'summit_reached',
  name: "Summit Reached",
  desc: "Unlocked the final biome — Summit of Light.",
  icon: <Sparkles className="text-yellow-400" />
}, {
  id: 'no_hints_needed',
  name: "No Hints Needed",
  desc: "Completed 10 consecutive sessions with zero hints.",
  icon: <Edit3 className="text-blue-300" />
}, {
  id: 'verse_virtuoso',
  name: "Verse Virtuoso",
  desc: "Correctly answered 50 question-type challenges in a row.",
  icon: <Check className="text-emerald-400" />
}, {
  id: 'tajweed_aware',
  name: "Tajweed Aware",
  desc: "Correctly identified 20 tajweed rules.",
  icon: <Moon className="text-purple-400" />
}, {
  id: 'early_bird',
  name: "Early Bird",
  desc: "Reviewed before 7am on 10 separate days.",
  icon: <Droplet className="text-sky-300" />
}, {
  id: 'patient_learner',
  name: "Patient Learner",
  desc: "Continued reviewing for 7 days after a broken streak.",
  icon: <MapIcon className="text-amber-500" />
}];