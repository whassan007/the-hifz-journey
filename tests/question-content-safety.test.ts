import { describe, it, expect } from 'vitest';
import { SURAHS } from '../src/data/registry';
import { getSafeVerses, isUniqueToSurah, findSurahsContaining, ALWAYS_EXCLUDED_PHRASES } from '../src/services/verseUniquenessValidator';

describe('Verse Content Uniqueness & Safety', () => {

  it('Never generates a question containing Blacklisted Bismillah variations', () => {
    // We check all safe verses for all surahs to ensure the blacklist holds.
    for (const surah of SURAHS) {
      const safePool = getSafeVerses(surah.id);
      
      for (const verse of safePool) {
         // Direct assertion that the excluded phrases do not slip through
         for (const phrase of ALWAYS_EXCLUDED_PHRASES) {
           expect(verse.verseText.includes(phrase)).toBe(false);
         }
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
    const surah55 = SURAHS.find(s => s.id === 55);
    // verses is an array of strings in the data layer (or objects if mapped)
    // Looking at SURAHS[].verses, they are typically strings in some setups, but here it's verse.text or just string array.
    // The previous error was "Property 'text' does not exist on type 'string'". So it's a string!
    const refrain = surah55?.verses[12] || ""; // fetch dynamically
    
    const isUnique = isUniqueToSurah(refrain, 55);
    expect(isUnique).toBe(true);

    const matchSet = findSurahsContaining(refrain);
    expect(matchSet).toEqual([55]);
  });

});
