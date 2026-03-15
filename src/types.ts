export type Biome = 'jungle' | 'ocean' | 'desert' | 'palace' | 'dream';
export type AgeGroup = 'seedling' | 'sapling' | 'rising_tree' | 'mighty_oak';
export type UserRole = 'student' | 'teacher';

export interface SurahNode {
  id: number;
  arabicName: string;
  transliteration: string;
  englishMeaning: string;
  verseCount: number;
  juzNumber: number;
  revelationType: string;
  bismillah: boolean;
}

export interface UserState {
  name: string | null;
  role: UserRole;
  ageGroup: AgeGroup;
  xp: number;
  hikmah: number;
  streak: number;
  completed: SurahNode[];
  badges: string[];
  audioEnabled: boolean;
  hapticEnabled: boolean;
  arabicFontSize: number;
  bgOpacity: number;
  classes?: ClassMembership[];
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: 'teacher';
  organization?: string;
  createdAt: string;
}

export interface Class {
  id: string;
  name: string;
  joinCode: string;
  teacherId: string;
  targetSurah?: string;
  createdAt: string;
  description?: string;
}

export interface ClassMembership {
  classId: string;
  studentId: string;
  joinedAt: string;
  status: 'active' | 'inactive';
}

export interface ProgressSnapshot {
  studentId: string;
  classId: string;
  versesMemorized: number;
  retentionPct: number;
  streak: number;
  lastActive: string;
  updatedAt: string;
}

export interface ClassAssignment {
  id: string;
  classId: string;
  title: string;
  surahRange: string;
  dueDate: string;
  createdByTeacherId: string;
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

