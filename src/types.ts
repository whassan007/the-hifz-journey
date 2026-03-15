export type Biome = 'jungle' | 'ocean' | 'desert' | 'palace' | 'dream';

export interface SurahNode {
  id: number;
  name: string;
  arabic: string;
  verses: number;
  biome: Biome;
  difficulty: number;
}

export interface UserState {
  name: string;
  xp: number;
  hikmah: number;
  streak: number;
  completed: number[];
  badges: string[];
  currentSurah: number;
  arabicFontSize: number;
  lastActiveDate: string;
  reviews: ReviewRecord[];
  mistakes: MistakeEntry[];
  audioEnabled: boolean;
  hapticEnabled: boolean;
  bgOpacity: number;
}

export interface ReviewRecord {
  surahId: number;
  verseNumber: number;
  easeFactor: number;
  intervalDays: number;
  repetitionCount: number;
  nextReviewDate: string;     // ISO8601
  lastReviewed: string;       // ISO8601
  qualityHistory: number[];   // 0-5 scale
  missCount: number;
}

export interface MistakeEntry {
  id: string;
  surahId: number;
  questionType: string;
  userAnswer: string;
  correctAnswer: string;
  hintShown: string;
  date: string;              // ISO8601
}

