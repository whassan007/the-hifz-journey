import type { UserState, ReviewRecord } from '../../types';

export interface RetentionSummary {
  overall_retention_pct: number;
  total_verses_memorized: number;
  streak_days: number;
  surahs_at_risk_count: number;
}

/**
 * Simulates GET /api/v1/user/retention-summary
 * Computes memory health off the SM-2 local cache.
 */
export async function fetchRetentionSummary(user: UserState, reviews: ReviewRecord[]): Promise<RetentionSummary> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const total_verses_memorized = reviews.length;
  const streak_days = user.streak;

  if (total_verses_memorized === 0) {
    return {
      overall_retention_pct: 0,
      total_verses_memorized: 0,
      streak_days,
      surahs_at_risk_count: 0
    };
  }

  let totalHealth = 0;
  const riskSurahs = new Set<number>();

  const now = new Date();

  for (const review of reviews) {
    // SM-2 Ease Factor typically starts at 2.5. We map EF 1.3 - 2.5+ to a 0-100% health score.
    // Plus, penalty for overdue reviews.
    const dueDate = new Date(review.nextReviewDate);
    const daysOverdue = Math.max(0, (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Base health from SM-2 ease (1.3 is minimum, 2.5 is typical good)
    let health = Math.min(100, Math.max(0, ((review.easeFactor - 1.3) / 1.2) * 100));
    
    // Decay health if overdue
    if (daysOverdue > 0) {
      health = Math.max(10, health - (daysOverdue * 5)); 
    }

    totalHealth += health;

    if (health < 60) {
      riskSurahs.add(review.surahId);
    }
  }

  const overall_retention_pct = Math.round(totalHealth / total_verses_memorized);

  return {
    overall_retention_pct,
    total_verses_memorized,
    streak_days,
    surahs_at_risk_count: riskSurahs.size
  };
}
