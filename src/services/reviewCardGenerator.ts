import UI from '../data/ui-text.json';
import { getSafeVerses, ALWAYS_EXCLUDED_PHRASES, isUniqueToSurah } from './verseUniquenessValidator';
import type { ReviewFormat, SessionHistory } from '../types';
import { SURAHS, getSurahById } from '../data/registry';

export interface ReviewCardPrompt {
  type: 'quiz';
  surahId: number;
  ayah: string;
  question: string;
  answer: string;
  options: string[];
  translation?: string;
  hint?: string;
  format: ReviewFormat; // Track which format was generated
  verseId: number;      // Help track history
}

export function buildReviewCard(surahId: number, sessionHistory?: SessionHistory): ReviewCardPrompt | null {
  const safeVerses = getSafeVerses(surahId);
  if (safeVerses.length === 0) return null;
  const surah = getSurahById(surahId);
  if (!surah) return null;

  const lastUsedVerseIds = sessionHistory?.lastPromptVerseIds || [];
  
  // Prefer verses not recently used
  const candidates = safeVerses.filter(v => !lastUsedVerseIds.includes(v.verseNumber));
  const pool = candidates.length > 0 ? candidates : safeVerses;

  // Decide next format (A -> B -> C -> A)
  const lastFormat = sessionHistory?.lastFormat || 'C'; // default so we start with A
  const nextFormat: ReviewFormat = lastFormat === 'A' ? 'B' : (lastFormat === 'B' ? 'C' : 'A');

  // Randomize a verse from pool
  const targetVerse = pool[Math.floor(Math.random() * pool.length)];

  switch (nextFormat) {
    case 'A': return generateFormatA(surahId, targetVerse.verseText, targetVerse.verseNumber);
    case 'B': return generateFormatB(surahId, targetVerse.verseText, targetVerse.verseNumber);
    case 'C': return generateFormatC(surahId, targetVerse.verseText, targetVerse.verseNumber);
  }
}

// Format A — Complete the verse
function generateFormatA(surahId: number, text: string, verseNum: number): ReviewCardPrompt | null {
  const words = text.split(' ');
  if (words.length <= 1) return generateFormatB(surahId, text, verseNum); // Fallback if verse is just 1 word
  
  const splitIndex = Math.ceil(words.length / 2);
  const firstHalf = words.slice(0, splitIndex).join(' ');
  const secondHalf = words.slice(splitIndex).join(' ');

  // Get other random verses as distractors
  const safeVerses = getSafeVerses(surahId).filter(v => v.verseNumber !== verseNum);
  const distractors = safeVerses
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map(v => {
      const parts = v.verseText.split(' ');
      return parts.slice(Math.ceil(parts.length / 2)).join(' ');
    });

  // If there aren't enough safe verses in this surah to make distractors, fallback to other surahs
  while (distractors.length < 3) {
      const otherSurah = SURAHS[Math.floor(Math.random() * SURAHS.length)];
      if (otherSurah.id === surahId) continue;
      if (otherSurah.verses && otherSurah.verses.length > 0) {
          const randomText = otherSurah.verses[Math.floor(Math.random() * otherSurah.verses.length)];
          const parts = randomText.split(' ');
          distractors.push(parts.slice(Math.ceil(parts.length / 2)).join(' '));
      }
  }

  const options = [secondHalf, ...distractors].sort(() => 0.5 - Math.random());

  return {
    type: 'quiz',
    surahId,
    format: 'A',
    verseId: verseNum,
    ayah: `${firstHalf} ...`,
    question: UI.ui_87, // What comes next?
    answer: secondHalf,
    options,
    hint: UI.ui_86
  };
}

// Format B — Which surah is this from?
function generateFormatB(surahId: number, text: string, verseNum: number): ReviewCardPrompt | null {
  const surah = getSurahById(surahId);
  if (!surah) return null;

  const allOtherSurahs = SURAHS.filter(s => s.id !== surahId);
  const distractors = [...allOtherSurahs].sort(() => 0.5 - Math.random()).slice(0, 3);
  
  const options = [surah.arabicName, ...distractors.map(d => d.arabicName)]
    .sort(() => 0.5 - Math.random());

  return {
    type: 'quiz',
    surahId,
    format: 'B',
    verseId: verseNum,
    ayah: text,
    question: UI.ui_85, // Which surah contains this verse?
    answer: surah.arabicName,
    options,
    hint: `This surah is ${surah.revelationType === 'Meccan' ? 'Meccan' : 'Medinan'}.`
  };
}

// Format C — What is verse {n} of this surah?
function generateFormatC(surahId: number, text: string, verseNum: number): ReviewCardPrompt | null {
  const surah = getSurahById(surahId);
  if (!surah) return null;

  const safeVerses = getSafeVerses(surahId).filter(v => v.verseNumber !== verseNum);
  const distractors = safeVerses
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map(v => v.verseText);

  // If there aren't enough safe verses in this surah to make distractors, fallback to other surahs
  while (distractors.length < 3) {
      const otherSurah = SURAHS[Math.floor(Math.random() * SURAHS.length)];
      if (otherSurah.id === surahId) continue;
      if (otherSurah.verses && otherSurah.verses.length > 0) {
          const randomText = otherSurah.verses[Math.floor(Math.random() * otherSurah.verses.length)];
          distractors.push(randomText);
      }
  }

  const options = [text, ...distractors].sort(() => 0.5 - Math.random());

  return {
    type: 'quiz',
    surahId,
    format: 'C',
    verseId: verseNum,
    ayah: `سورة ${surah.arabicName} · آية ${verseNum}`,
    question: `اذكر الآية رقم ${verseNum}`, // Recite verse n
    answer: text,
    options,
    hint: UI.ui_84
  };
}

export function validateSessionCards(cards: ReviewCardPrompt[]): { cards: ReviewCardPrompt[], violations: number } {
  const safeCards = [...cards];
  let violations = 0;

  for (let i = 0; i < safeCards.length; i++) {
    const card = safeCards[i];
    
    // Specifically test the text shown to the user (the prompt/ayah)
    // If format B, it's the full verse. Format A it's the first half. Format C it's the surah name which is fine.
    if (card.format !== 'C') {
        const isBismillahBlacklisted = ALWAYS_EXCLUDED_PHRASES.some((phrase: string) => card.ayah.includes(phrase));
        // We only require full uniqueness for format B (full verse).
        const isNotUnique = card.format === 'B' ? !isUniqueToSurah(card.ayah, card.surahId) : false;
        
        if (isBismillahBlacklisted || isNotUnique) {
          violations++;
          // Generate a replacement (defaulting to B to guarantee it attempts safe verses)
          const safeVerse = getSafeVerses(card.surahId)[0];
          if (safeVerse) {
            const replacement = generateFormatB(card.surahId, safeVerse.verseText, safeVerse.verseNumber);
            if (replacement) {
                replacement.format = card.format; // keep whatever format it was supposed to be in tracking
                safeCards[i] = replacement;
            }
          }
        }
    }
  }

  return { cards: safeCards, violations };
}
