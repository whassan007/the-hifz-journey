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
  verses: string[];
}

export interface Bookmark {
  id: string;
  surahId: number;
  ayahNumber: number;
  arabicText: string;
  note: string | null;
  createdAt: string;
  color: 'green' | 'amber' | 'blue' | 'pink';
}

export interface Highlight {
  id: string;
  surahId: number;
  ayahNumber: number;
  startOffset: number;
  endOffset: number;
  selectedText: string;
  color: 'yellow' | 'green' | 'blue' | 'pink';
  note: string | null;
  createdAt: string;
}

export type ReaderSpacing = 'compact' | 'normal' | 'wide';
export type ReaderDisplayMode = 'arabic_only' | 'arabic_transliteration' | 'arabic_translation';
export type ReaderTheme = 'match_app' | 'light' | 'dark' | 'sepia';

export interface ReaderSettings {
  fontSize: number; // 1-5 scale
  lineSpacing: ReaderSpacing;
  displayMode: ReaderDisplayMode;
  theme: ReaderTheme;
}

export interface UserState {
  name: string | null;
  role: UserRole;
  ageGroup: AgeGroup;
  xp: number;
  islamicKnowledgeXp?: number;
  hikmah: number;
  streak: number;
  lastActive: string;
  completed: SurahNode[];
  unlockedImamIds?: number[];
  completedImamIds?: number[];
  badges: string[];
  audioEnabled: boolean;
  hapticEnabled: boolean;
  arabicFontSize: number;
  bgOpacity: number;
  classes?: ClassMembership[];
  bookmarks: Bookmark[];
  highlights: Highlight[];
  readSurahs: number[]; // Array of surah IDs that have been opened in the reader
  readerSettings: ReaderSettings;
  sessionHistory?: Record<number, SessionHistory>; // Keyed by surahId
}

export interface ImamNode {
  id: number;
  name: string;
  kunya: string;
  title: string;
  birthCity: string;
  birthYear: number;
  martyrdomYear: number | string; // Could be 'Living' for the 12th Imam
  burialCity: string;
  father: string;
  mother: string;
  hadith: string;
  bio: string;
  shrineUrl?: string;
  companions?: string[];
}

export interface ImamReviewRecord {
  imamId: number;
  easeFactor: number;
  intervalDays: number;
  repetitionCount: number;
  nextReviewDate: string;     // ISO8601
  lastReviewed: string;       // ISO8601
  qualityHistory: number[];   // 0-5 scale
  missCount: number;
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
  original_biome?: string;
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

export type ReviewFormat = 'A' | 'B' | 'C'; // A: Complete verse, B: Which surah, C: Recite verse N

export interface SessionHistory {
  surahId: number;
  lastPromptVerseIds: number[];  // last 3 verse IDs (relative index) used as prompts
  lastFormat: ReviewFormat;
  lastSessionAt: string;         // ISO timestamp
}

export type QuestionType =
  | 'Word Scramble'
  | 'Fill-in-the-Blank'
  | 'First-Letter Scaffolding'
  | 'Direct Indexing'
  | 'Positional Mastery'
  | 'Verse-to-Page Mapping'
  | 'Contextual Flow Forward'
  | 'Contextual Flow Reverse'
  | 'Mutashabihat Match'
  | 'Disambiguation'
  | 'Chain Interruption'
  | 'Oral Recitation';

export type DifficultyTier = 'Adaptive' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Very Advanced';

export interface VerseRange {
  start: number;
  end: number;
}

export interface SessionConfig {
  surahIds: number[];
  verseRanges: Record<number, VerseRange>; // Key is surahId
  questionCount: number;
  questionTypes: QuestionType[];
  difficulty: DifficultyTier;
}

export interface SessionPreset {
  id: string;
  name: string;
  config: SessionConfig;
  createdAt: string;
}

