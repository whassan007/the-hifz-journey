// SM-2 Spaced Repetition Algorithm

export function calculateSM2(
  quality: number, // 0-5
  previousRepetitions: number,
  previousEaseFactor: number,
  previousInterval: number
) {
  let interval;
  let repetitions = previousRepetitions;
  let easeFactor = previousEaseFactor;

  if (quality >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(previousInterval * easeFactor);
    }
    repetitions += 1;
    
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    easeFactor = Math.max(1.3, easeFactor); // Minimum ease factor is 1.3
  } else {
    repetitions = 0;
    interval = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  }

  // Calculate next review date by adding interval days to current date
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  return { 
    intervalDays: interval, 
    repetitionCount: repetitions, 
    easeFactor: easeFactor,
    nextReviewDate: nextDate.toISOString()
  };
}

export function getQualityScore(isCorrect: boolean, timeElapsedMs: number, missCountThisSession: number): number {
  if (isCorrect) {
    if (missCountThisSession > 0) return 3; // Correct eventually, but had mistakes
    if (timeElapsedMs < 3000) return 5;     // Perfect, fast
    if (timeElapsedMs < 8000) return 4;     // Hesitation
    return 3;                               // Slow
  } else {
    // We only call this when recording a final sequence or if they abandon
    return missCountThisSession > 1 ? 1 : 2;
  }
}
