// Meta 数据采集器 — 从 Limitless TCG 获取实时赛事数据
// 服务端定时任务逻辑

interface TournamentResult {
  tournamentId: string;
  date: string;
  name: string;
  players: number;
  standings: Array<{
    rank: number;
    playerName: string;
    deckName: string;
    wins: number;
    losses: number;
    ties: number;
  }>;
}

interface MetaReport {
  generatedAt: string;
  totalTournaments: number;
  totalGames: number;
  topDecks: Array<{
    name: string;
    winRate: number;
    playRate: number;
    games: number;
    trend: "up" | "down" | "stable";
  }>;
  recentWinners: Array<{
    deckName: string;
    tournamentName: string;
    date: string;
  }>;
}

// 从赛事数据计算 Meta 报告
export function calculateMeta(tournaments: TournamentResult[]): MetaReport {
  const deckStats = new Map<
    string,
    { wins: number; games: number; tournaments: Set<string>; recentWins: number }
  >();
  const winners: MetaReport["recentWinners"] = [];

  for (const tour of tournaments) {
    // 冠军
    const winner = tour.standings.find((s) => s.rank === 1);
    if (winner) {
      winners.push({
        deckName: winner.deckName,
        tournamentName: tour.name,
        date: tour.date,
      });
    }

    for (const player of tour.standings) {
      const stats = deckStats.get(player.deckName) || {
        wins: 0,
        games: 0,
        tournaments: new Set<string>(),
        recentWins: 0,
      };

      const totalGames = player.wins + player.losses + (player.ties || 0);
      stats.wins += player.wins;
      stats.games += totalGames;
      stats.tournaments.add(tour.tournamentId);

      // 近期表现（rank top 8 算作近期优势）
      if (player.rank <= 8) {
        stats.recentWins += player.wins;
      }

      deckStats.set(player.deckName, stats);
    }
  }

  // 计算总数据
  let totalGames = 0;
  for (const stats of deckStats.values()) {
    totalGames += stats.games;
  }

  // 排序取 Top 15
  const topDecks: MetaReport["topDecks"] = Array.from(deckStats.entries())
    .map(([name, stats]) => ({
      name,
      winRate: stats.games > 0 ? Math.round((stats.wins / stats.games) * 100) : 0,
      playRate: totalGames > 0 ? Math.round((stats.games / totalGames) * 1000) / 10 : 0,
      games: stats.games,
      trend: (stats.recentWins / Math.max(stats.games, 1)) > 0.55
        ? "up"
        : (stats.recentWins / Math.max(stats.games, 1)) < 0.45
          ? "down"
          : "stable",
    }))
    .filter((d) => d.games >= 20)
    .sort((a, b) => b.playRate - a.playRate)
    .slice(0, 15);

  return {
    generatedAt: new Date().toISOString(),
    totalTournaments: tournaments.length,
    totalGames,
    topDecks,
    recentWinners: winners.slice(0, 10),
  };
}
