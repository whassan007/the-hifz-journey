import type { SurahNode } from '../types';

export interface VerseSelectionOptions {
  count?: number;
  surahFilter?: number;       // ID of specific Surah to pull from
  completedSurahs?: SurahNode[]; // Array of surahs the user has completed
}

const RECENTLY_SERVED_KEY = 'hifz_recently_served_verses';
const RECENTLY_SERVED_MAX = 50;

/**
 * Gets the list of recently served verses from local storage to avoid immediate repetition.
 */
function getRecentlyServed(): string[] {
  try {
    const raw = localStorage.getItem(RECENTLY_SERVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Adds a verse to the recently served list.
 * @param verseId Format: "surahId:verseIndex"
 */
function addRecentlyServed(verseId: string) {
  try {
    const recent = getRecentlyServed();
    recent.unshift(verseId);
    if (recent.length > RECENTLY_SERVED_MAX) {
      recent.length = RECENTLY_SERVED_MAX; // Truncate
    }
    localStorage.setItem(RECENTLY_SERVED_KEY, JSON.stringify(recent));
  } catch (e) {
    console.error("Failed to save recently served verses", e);
  }
}

/**
 * Returns an array of indices that represent a randomized order of verses to serve.
 */
export function getRandomVerses(
  surah: SurahNode, 
  options?: VerseSelectionOptions
): string[] {
  const count = options?.count || 5;
  const recentVerses = getRecentlyServed();
  
  // Create a pool of all available verse indices for the target Surah
  let pool = Array.from({length: surah.verseCount}, (_, i) => i);
  
  // Filter out recently served verses if our pool is large enough to allow it
  const unservedPool = pool.filter(index => !recentVerses.includes(`${surah.id}:${index}`));
  
  // Fall back to the full pool if we filtered out everything (e.g., short Surah)
  if (unservedPool.length >= Math.min(count, surah.verseCount)) {
    pool = unservedPool;
  }
  
  // Simple Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  
  // Take exactly `count` or as many as exist
  const selectedIndices = pool.slice(0, count);
  
  // Mark these selected ones as recently served
  selectedIndices.forEach(idx => addRecentlyServed(`${surah.id}:${idx}`));
  
  // Map back to actual verse strings based on the original Surah array
  return selectedIndices.map(idx => surah.verses[idx] || '');
}
