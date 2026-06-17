// 本地统计数据追踪
// 只记录用户真实使用数据，绝不凭空捏造

const STATS_KEY = "pokemind-stats";

export interface UsageStats {
  deckAnalyses: number;
  battleReviews: number;
  aiPracticeMessages: number;
  lastActiveDate: string;
  streak: number;
  totalActions: number;
}

export function getStats(): UsageStats {
  if (typeof window === "undefined") {
    return {
      deckAnalyses: 0,
      battleReviews: 0,
      aiPracticeMessages: 0,
      lastActiveDate: "",
      streak: 0,
      totalActions: 0,
    };
  }

  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }

  return {
    deckAnalyses: 0,
    battleReviews: 0,
    aiPracticeMessages: 0,
    lastActiveDate: "",
    streak: 0,
    totalActions: 0,
  };
}

export function recordAction(
  type: "deck-analysis" | "battle-review" | "ai-practice"
) {
  if (typeof window === "undefined") return;

  const stats = getStats();
  const today = new Date().toISOString().split("T")[0];

  if (type === "deck-analysis") stats.deckAnalyses++;
  if (type === "battle-review") stats.battleReviews++;
  if (type === "ai-practice") stats.aiPracticeMessages++;

  stats.totalActions++;

  // 计算连续使用天数
  if (stats.lastActiveDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (stats.lastActiveDate === yesterdayStr) {
      stats.streak++;
    } else if (stats.lastActiveDate !== today) {
      stats.streak = 1;
    }
    stats.lastActiveDate = today;
  }

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }

  return stats;
}
