import { describe, it, expect } from 'vitest';
import { SURAH_GROUND_TRUTH } from './surah-ground-truth';
import { SURAHS } from '../src/data/registry';
import { getSurahById, getProgressMapNodes } from '../src/data/registry';
import { createReviewCard } from '../src/sm2';

describe('HIFZ JOURNEY — Surah Content Audit', () => {

  const hasArabicChars = (str: string) => /[\u0600-\u06FF]/.test(str);

  const errors: string[] = [];
  
  const reportError = (message: string) => {
    errors.push(message);
    console.error(message);
  }

  // Check 1: Completeness structure
  it('has exactly 114 surahs and a sequential ID range without gaps', () => {
    try {
      expect(SURAHS.length).toBe(114);
      
      const ids = SURAHS.map(s => s.id).sort((a,b) => a - b);
      for(let i=1; i<=114; i++) {
        expect(ids[i-1]).toBe(i);
      }
    } catch(e) {
      reportError("FAIL  Core Registry is missing Surahs or has duplicates");
      throw e;
    }
  });

  // Check 2: Total Verse Count (Hafs = 6236)
  it('total verse count across all surahs === 6236 (Hafs narration)', () => {
    const totalVerses = SURAHS.reduce((acc, surah) => acc + surah.verseCount, 0);
    try {
      expect(totalVerses).toBe(6236);
    } catch (e) {
      reportError(`FAIL  Total Verse Count  expected: 6236  received: ${totalVerses}`);
      throw e;
    }
  });

  // Check 3: Bismillah flag
  it('exactly 1 surah has bismillah === false (Surah 9)', () => {
    const withoutBismillah = SURAHS.filter(s => s.bismillah === false);
    try {
      expect(withoutBismillah.length).toBe(1);
      expect(withoutBismillah[0].id).toBe(9);
    } catch (e) {
      reportError(`FAIL  Bismillah flag exception count  expected: 1 (Surah 9)  received: ${withoutBismillah.length}`);
      throw e;
    }
  });

  // Check 4: Meccan / Medinan specific counts
  it('has exactly 86 Meccan and 28 Medinan surahs', () => {
    const meccan = SURAHS.filter(s => s.revelationType === 'Meccan');
    const medinan = SURAHS.filter(s => s.revelationType === 'Medinan');
    try {
      expect(meccan.length).toBe(86);
      expect(medinan.length).toBe(28);
    } catch (e) {
      reportError(`FAIL  Revelation count  expected: 86/28  received: ${meccan.length}/${medinan.length}`);
      throw e;
    }
  });

  // Check 5: Juz Constraints
  it('juz numbers are integers in range [1, 30]', () => {
    let badJuz = false;
    SURAHS.forEach(surah => {
      if(!Number.isInteger(surah.juzNumber) || surah.juzNumber < 1 || surah.juzNumber > 30) {
        reportError(`FAIL  Surah ${surah.id} juzNumber  expected: valid range 1-30  received: ${surah.juzNumber}`);
        badJuz = true;
      }
    });
    expect(badJuz).toBe(false);
  });

  // Check 6: Unique Arabic and Transliteration names + Char checks
  it('all surahs have unique english and arabic names with correct char ranges', () => {
    const arabicNames = new Set<string>();
    const englishNames = new Set<string>();
    let badNames = false;

    SURAHS.forEach(surah => {
      if(!hasArabicChars(surah.arabicName)) {
        reportError(`FAIL  Surah ${surah.id} arabicName  expected: unicode arabic  received: ${surah.arabicName}`);
        badNames = true;
      }

      if(arabicNames.has(surah.arabicName)) {
        reportError(`FAIL  Surah ${surah.id} arabicName  expected: unique  received: dup ${surah.arabicName}`);
        badNames = true;
      }
      arabicNames.add(surah.arabicName);

      if(englishNames.has(surah.transliteration)) {
        reportError(`FAIL  Surah ${surah.id} transliteration expected: unique  received: dup ${surah.transliteration}`);
        badNames = true;
      }
      englishNames.add(surah.transliteration);
      
      if(!surah.englishMeaning || surah.englishMeaning.length === 0) {
        reportError(`FAIL  Surah ${surah.id} englishMeaning expected: non-empty string`);
        badNames = true;
      }
    });

    expect(badNames).toBe(false);
  });

  // Check 7: Ground Truth Direct Assertions Node by Node
  it('matches exactly with SURAH_GROUND_TRUTH canonical source', () => {
    let mismatches = 0;

    SURAH_GROUND_TRUTH.forEach(truth => {
      const reg = SURAHS.find(s => s.id === truth.id);
      if(!reg) {
        reportError(`FAIL  Surah ${truth.id} missing completely in registry.`);
        mismatches++;
        return;
      }

      const checks: Array<{ field: string, expected: number | string | boolean | undefined, received: number | string | boolean | undefined }> = [
        { field: 'verseCount', expected: truth.verseCount, received: reg.verseCount },
        { field: 'revelationType', expected: truth.revelationType, received: reg.revelationType },
        { field: 'juzNumber', expected: truth.juzNumber, received: reg.juzNumber },
        // { field: 'transliteration', expected: truth.transliteration, received: reg.transliteration },
      ];

      // bismillah check (if explicitly supplied)
      if (truth.bismillah !== undefined) {
         checks.push({ field: 'bismillah', expected: truth.bismillah, received: reg.bismillah !== false }); 
         // Note: in registry if omitted it acts as true implicitly, unless false
      }

      checks.forEach(check => {
        if(check.expected !== check.received) {
           reportError(`FAIL  Surah ${truth.id}  ${check.field}  expected: ${check.expected}  received: ${check.received}`);
           mismatches++;
        }
      });
    });

    expect(mismatches).toBe(0);
  });

  // Check 8: System Review API integrations
  it('wiring verification: resolves to valid models and review nodes', () => {
    try {
      // 1. Every ID resolves
      for(let i=1; i<=114; i++) {
        expect(getSurahById(i)).toBeDefined();
      }

      // 2. SM-2 Card Creation
      for(let i=1; i<=114; i++) {
        const card = createReviewCard(i, 1);
        expect(card).toBeDefined();
        expect(card.surahId).toBe(i);
        expect(card.verseNumber).toBe(1);
      }

      // 3. Progress Map size
      const mapNodes = getProgressMapNodes();
      expect(mapNodes.length).toBe(114);

    } catch (e) {
      reportError("FAIL  Wiring Verification crashed during dynamic method execution");
      throw e;
    }
  });

  // Final Hook to output exactly what the user requested.
  it('spits out the requested report cleanly', () => {
    const totalSurahs = SURAHS.length;
    const totalVerses = SURAHS.reduce((acc, a) => acc + a.verseCount, 0);
    const meccan = SURAHS.filter(s => s.revelationType === 'Meccan').length;
    const medinan = SURAHS.filter(s => s.revelationType === 'Medinan').length;
    let bismillahExceptions = 0;
    if(SURAHS.find(s => s.id === 9 && s.bismillah === false)) {
        bismillahExceptions = 1;
    }
    const arabicNamePresent = SURAHS.filter(s => s.arabicName && s.arabicName.length > 0).length;

    console.log(`
HIFZ JOURNEY — Surah Content Audit
=====================================
Total surahs:         ${totalSurahs} / 114  ${totalSurahs===114?'✓':''}
Total verse count:    ${totalVerses} / 6236  ${totalVerses===6236?'✓':''}
Meccan count:         ${meccan} / 86  ${meccan===86?'✓':''}
Medinan count:        ${medinan} / 28  ${medinan===28?'✓':''}
Bismillah exceptions: ${bismillahExceptions} / 1 (Surah 9 only)  ${bismillahExceptions===1?'✓':''}
Arabic name present:  ${arabicNamePresent} / 114  ${arabicNamePresent===114?'✓':''}

Field-level failures: ${errors.length}
Value mismatches:     ${errors.length}
Missing surahs:       ${114 - totalSurahs === 0 ? 'none' : 114 - totalSurahs}

STATUS: ${errors.length === 0 ? 'PASS' : 'FAIL'}
`);

    if (errors.length > 0) {
        throw new Error("Audit Failed Check Logs");
    }
  });
});
