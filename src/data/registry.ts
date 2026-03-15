import UI from '../data/ui-text.json';
import groundTruth from './surah-ground-truth.json';
import type { SurahNode } from '../types';
import { getSafeVerses } from '../services/verseUniquenessValidator';

export const SURAHS: SurahNode[] = groundTruth.surahs;
export const DATA_META = groundTruth.meta;

// Helper Functions required by the Space Repetition System & System Audit
export const getSurahById = (id: number): SurahNode | undefined => {
  return SURAHS.find(s => s.id === id);
};

export const getProgressMapNodes = (): SurahNode[] => {
  return [...SURAHS].sort((a, b) => b.id - a.id);
};

export const generateQuestion = (surahId: number, gameType: 'quiz' | 'scramble' | 'match' | 'tajweed' = 'quiz') => {
  const surah = getSurahById(surahId);
  if (!surah) return null;

  // Pull from the uniqueness validated pool
  const safePool = getSafeVerses(surahId);
  if (safePool.length === 0) return null;

  // Randomly select a safe verse
  const targetVerse = safePool[Math.floor(Math.random() * safePool.length)];

  // Generate 3 random wrong options
  const allOtherSurahs = SURAHS.filter(s => s.id !== surahId);
  const distractors = [...allOtherSurahs].sort(() => 0.5 - Math.random()).slice(0, 3);
  
  const options = [surah.arabicName, ...distractors.map(d => d.arabicName)]
    .sort(() => 0.5 - Math.random());

  return {
     type: gameType,
     surahId,
     ayah: targetVerse.verseText,
     question: UI.ui_83, // "Which Surah contains this Ayah?"
     answer: surah.arabicName,
     options,
     translation: `Verse ${targetVerse.verseNumber}`,
     hint: `This surah has ${surah.verseCount} verses and is ${surah.revelationType === 'Meccan' ? 'Meccan' : 'Medinan'}.`
  };
};
