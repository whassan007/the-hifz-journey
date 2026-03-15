import { SURAHS } from '../data/registry';

// Normalize Uthmani text for comparison by stripping diacritics and normalizing skeletons
const normalizeArabic = (text: string) => {
  return text
    // Strip diacritics
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    // Normalize Alifs (Wasla, Madda, Hamza above/below) -> plain Alif
    .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')
    // Drop standalone/waw/ya hamzas entirely to unify roots like ءالاء vs آلاء
    .replace(/[\u0621\u0624\u0626]/g, '')
    // Normalize Yaa (Alef Maksura) -> Yaa
    .replace(/[\u0649]/g, '\u064A')
    // Normalize Ta Marbuta -> Ha (optional, but good for match robustness)
    .replace(/\u0629/g, '\u0647')
    // Strip tatweel/kashida
    .replace(/\u0640/g, '');
};

export const ALWAYS_EXCLUDED_PHRASES = [
  "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", // Full Bismillah
  "بسم الله الرحمن الرحيم",         // Bismillah plain
  "الرَّحْمَٰنِ الرَّحِيمِ",         // Ar-Rahman Ar-Raheem
  "الرحمن الرحيم",                  // Ar-Rahman Ar-Raheem plain
  "بِسْمِ اللَّهِ",                  // Bismillah component
  "بسم الله"                        // Bismillah component plain
];

/**
 * Returns the list of surah IDs where this exact text fragment appears
 */
export const findSurahsContaining = (text: string): number[] => {
  if (!text || text.trim() === '') return [];
  
  const normalizedSearch = normalizeArabic(text).trim();
  const matchedSurahIds = new Set<number>();

  for (const surah of SURAHS) {
    if (!surah.verses) continue;
    
    for (const verse of surah.verses) {
      if (normalizeArabic(verse).includes(normalizedSearch)) {
        matchedSurahIds.add(surah.id);
        break; // Found in this surah, move to next surah
      }
    }
  }

  return Array.from(matchedSurahIds);
};

/**
 * Returns true only if the given text fragment does not appear
 * in any surah other than the specified one.
 */
export const isUniqueToSurah = (text: string, surahId: number): boolean => {
  if (isPhaseBlacklisted(text)) return false;
  
  const matches = findSurahsContaining(text);
  
  // It's unique if it's found in exactly 1 surah AND that surah is the target
  return matches.length === 1 && matches[0] === surahId;
};

// Check if a phrase contains any of the globally excluded strings
const isPhaseBlacklisted = (text: string): boolean => {
  const normText = normalizeArabic(text);
  for (const excluded of ALWAYS_EXCLUDED_PHRASES) {
    if (normText.includes(normalizeArabic(excluded))) {
      return true;
    }
  }
  return false;
};

/**
 * Returns the safe verses for a surah — all verses that pass
 * the uniqueness check and are not on the blacklist.
 */
export const getSafeVerses = (surahId: number): { verseText: string, verseNumber: number }[] => {
  const surah = SURAHS.find(s => s.id === surahId);
  if (!surah || !surah.verses) return [];
  
  const safeVerses: { verseText: string, verseNumber: number }[] = [];

  surah.verses.forEach((verse, index) => {
    const verseNumber = index + 1;
    
    // Quick exclude: Bismillah checks
    if (isPhaseBlacklisted(verse)) {
      return; 
    }
    
    // Deep exclude: Cross-surah uniqueness mapping
    if (isUniqueToSurah(verse, surahId)) {
      safeVerses.push({ verseText: verse, verseNumber });
    }
  });

  return safeVerses;
};
