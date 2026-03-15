import groundTruth from './surah-ground-truth.json';
import type { SurahNode } from '../types';

export const SURAHS: SurahNode[] = groundTruth.surahs;
export const DATA_META = groundTruth.meta;

// Helper Functions required by the Space Repetition System & System Audit
export const getSurahById = (id: number): SurahNode | undefined => {
  return SURAHS.find(s => s.id === id);
};

export const getProgressMapNodes = (): SurahNode[] => {
  return [...SURAHS].sort((a, b) => b.id - a.id);
};

export const generateQuestion = (surahId: number) => {
  const surah = getSurahById(surahId);
  if (!surah) return null;
  return {
     surahId,
     question: "Which Juz is " + surah.transliteration + " in?",
     answer: surah.juzNumber.toString()
  }
};
