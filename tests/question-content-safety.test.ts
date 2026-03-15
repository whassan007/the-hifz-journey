import { describe, it, expect } from 'vitest';
import { MOCK_QUESTIONS } from '../src/data/mockQuestions';
import { SURAHS } from '../src/data/registry';
import { getSafeVerses, isUniqueToSurah, findSurahsContaining } from '../src/services/verseUniquenessValidator';

describe('Verse Content Uniqueness & Safety', () => {

  it('Never generates a question containing Blacklisted Bismillah variations', () => {
    // We check all safe verses for all surahs to ensure the blacklist holds.
    for (const surah of SURAHS) {
      const safePool = getSafeVerses(surah.id);
      
      for (const verse of safePool) {
         // Direct assertion that the "Bismillah" phrase does not slip through
         expect(verse.verseText.includes("بسم الله الرحمن الرحيم")).toBe(false);
         expect(verse.verseText.includes("الرحمن الرحيم")).toBe(false);
         expect(verse.verseText.includes("بسم الله")).toBe(false);
      }
    }
  }, 120000); // 120 second timeout for O(N^2) dataset lookup

  it('Ensures getSafeVerses only returns globally unique phrases', () => {
    // Let's test Al-Ikhlas (112), which is completely unique
    const ikhlasSafe = getSafeVerses(112);
    expect(ikhlasSafe.length).toBeGreaterThan(0);
    
    // Check that one of its verses is only pointing back to 112
    const matches = findSurahsContaining(ikhlasSafe[0].verseText);
    expect(matches).toEqual([112]);
  });

  it('Verifies Ar-Rahman (Surah 55) refrain uniqueness resolution', () => {
    // "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ" occurs 31 times in 55. 
    // It is technically unique to Surah 55. So `isUniqueToSurah` should be true.
    const isUnique = isUniqueToSurah("فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ", 55);
    expect(isUnique).toBe(true);

    const matchSet = findSurahsContaining("فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ");
    expect(matchSet).toEqual([55]);
  });

});
