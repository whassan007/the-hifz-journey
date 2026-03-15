import { SURAHS } from '../data/registry';


// Normalize Uthmani text for comparison by stripping diacritics and normalizing skeletons
const normalizeArabic = (text: string) => {
  return text
    // Strip diacritics
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    // Normalize Alifs (Wasla, Madda, Hamza above/below) -> plain Alif
    // eslint-disable-next-line local/no-hardcoded-arabic
    .replace(/[\u0622\u0623\u0625\u0671]/g, 'ا')
    // Drop standalone/waw/ya hamzas entirely to unify roots like ءالاء vs آلاء
    .replace(/[\u0621\u0624\u0626]/g, '')
    // Normalize Yaa (Alef Maksura) -> Yaa
    // eslint-disable-next-line local/no-hardcoded-arabic
    .replace(/[\u0649]/g, 'ي')
    // Normalize Ta Marbuta -> Ha (optional, but good for match robustness)
    // eslint-disable-next-line local/no-hardcoded-arabic
    .replace(/\u0629/g, 'ه');
};

// Bismillah phrase dynamic lookup 
const getFatihaBismillah = () => {
  const fatiha = SURAHS.find(s => s.id === 1);
  // Ensure fatiha and its verses exist before accessing
  if (!fatiha || !fatiha.verses || fatiha.verses.length < 3) return [];
  
  // Assuming verse 0 is Bismillah and verse 2 is Ar-Rahman Ar-Raheem
  // Note: The original data structure for SURAHS.verses might need to be { text: string }[]
  // If it's just string[], then fatiha.verses[0] and fatiha.verses[2] are already strings.
  // For now, assuming it's string[] based on original `verse` usage.
  const v1 = fatiha.verses[0]; // Bismillah
  const v3 = fatiha.verses[2]; // Ar-Rahman Ar-Raheem
  
  // The diacritic stripping here is specific to the Bismillah phrases,
  // not the full normalizeArabic function.
  const stripDiacriticsForBismillah = (text: string) => 
    text.replace(/[\u064B-\u065F\u0670]/g, '');

  return [
    v1,
    stripDiacriticsForBismillah(v1),
    v3,
    stripDiacriticsForBismillah(v3),
    v1.split(' ').slice(0, 2).join(' '), // "بِسْمِ اللَّهِ"
    stripDiacriticsForBismillah(v1).split(' ').slice(0, 2).join(' ') // "بسم الله"
  ];
};

export const ALWAYS_EXCLUDED_PHRASES = getFatihaBismillah();

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
