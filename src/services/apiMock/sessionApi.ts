import type { ReviewRecord, SessionConfig } from '../../types';
import { getSurahById } from '../../data/registry';

export interface SurahBreakdown {
  surahId: number;
  arabicName: string;
  verseCountDue: number;
}

export interface TodaySessionPlan {
  session_id: string;
  estimated_minutes: number;
  total_verses: number;
  surah_breakdown: SurahBreakdown[];
  question_type_mix: string[];
}

/**
 * Simulates GET /api/v1/session/today
 * Parses the local SM-2 history to dynamically aggregate all pending items into a daily drill plan.
 */
export async function fetchTodaySession(reviews: ReviewRecord[]): Promise<TodaySessionPlan | null> {
  await new Promise(resolve => setTimeout(resolve, 400)); // Simulate latency

  const now = new Date();
  
  // Filter for due reviews using the ISO nextReviewDate string
  const dueReviews = reviews.filter(r => new Date(r.nextReviewDate).getTime() <= now.getTime());

  if (dueReviews.length === 0) {
    return null;
  }

  // Aggregate by Surah
  const breakdownMap = new Map<number, number>();
  for (const r of dueReviews) {
    breakdownMap.set(r.surahId, (breakdownMap.get(r.surahId) || 0) + 1);
  }

  const surah_breakdown: SurahBreakdown[] = Array.from(breakdownMap.entries())
    .map(([surahId, verseCountDue]) => ({
      surahId,
      arabicName: getSurahById(surahId)?.arabicName || 'Unknown',
      verseCountDue
    }))
    .sort((a, b) => b.verseCountDue - a.verseCountDue);

  const total_verses = dueReviews.length;
  // Estimate ~45 seconds per question on average
  const estimated_minutes = Math.max(1, Math.round((total_verses * 45) / 60));

  return {
    session_id: `session_${now.toISOString().split('T')[0]}`,
    estimated_minutes,
    total_verses,
    surah_breakdown,
    question_type_mix: ["Flow", "Scramble", "Fill-in-the-blank"]
  };
}

/**
 * Simulates POST /api/v1/session/create
 */
export async function createSession(config: SessionConfig): Promise<{ session_id: string; message: string }> {
  await new Promise(resolve => setTimeout(resolve, 600)); // Simulate latency
  console.log("Creating session with config:", config);
  return {
    session_id: `custom_${Date.now()}`,
    message: "Session generated successfully"
  };
}
