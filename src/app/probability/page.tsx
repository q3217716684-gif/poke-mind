"use client";

import { useState, useMemo } from "react";
import GlassCard from "@/components/GlassCard";

// 超几何分布计算
function hypergeometric(N: number, K: number, n: number, k: number): number {
  const comb = (a: number, b: number): number => {
    if (b > a || b < 0) return 0;
    let result = 1;
    for (let i = 1; i <= b; i++) {
      result = (result * (a - i + 1)) / i;
    }
    return result;
  };
  return (comb(K, k) * comb(N - K, n - k)) / comb(N, n);
}

function calcProbability(deckSize: number, copies: number, drawCount: number, needed: number) {
  // P(抽到 >= needed 张) = 1 - P(抽到 0) - P(抽到 1) - ... - P(抽到 needed-1)
  let prob = 0;
  for (let k = needed; k <= Math.min(copies, drawCount); k++) {
    prob += hypergeometric(deckSize, copies, drawCount, k);
  }
  return Math.min(prob, 1);
}

export default function ProbabilityCalculator() {
  const [deckSize, setDeckSize] = useState(60);
  const [targetCopies, setTargetCopies] = useState(4);
  const [drawCount, setDrawCount] = useState(7);
  const [neededCount, setNeededCount] = useState(1);
  const [comboMode, setComboMode] = useState(false);
  const [comboCopies2, setComboCopies2] = useState(4);

  const probability = useMemo(() => {
    if (deckSize <= 0 || drawCount <= 0 || targetCopies <= 0) return 0;
    if (neededCount > targetCopies || neededCount > drawCount) return 0;

    if (comboMode && comboCopies2 > 0) {
      // 双卡 combo：至少各抽到一张
      const probA = calcProbability(deckSize, targetCopies, drawCount, 1);
      const probBGivenA = calcProbability(deckSize - 1, comboCopies2, drawCount - 1, 1);
      return probA * probBGivenA;
    }

    return calcProbability(deckSize, targetCopies, drawCount, neededCount);
  }, [deckSize, targetCopies, drawCount, neededCount, comboMode, comboCopies2]);

  const probPercent = (probability * 100).toFixed(1);

  const getColor = () => {
    const p = probability;
    if (p >= 0.8) return "text-green-400";
    if (p >= 0.5) return "text-pokemon-yellow";
    if (p >= 0.3) return "text-yellow-600";
    return "text-red-400";
  };

  const scenarios = useMemo(() => {
    const results: { label: string; prob: number }[] = [];

    // 不同起手概率
    if (!comboMode) {
      results.push({ label: "起手（7张）", prob: calcProbability(deckSize, targetCopies, 7, neededCount) });
      results.push({ label: "起手+抽1（8张）", prob: calcProbability(deckSize, targetCopies, 8, neededCount) });
      results.push({ label: "博士研究后（14张）", prob: calcProbability(deckSize, targetCopies, 14, neededCount) });
      results.push({ label: "T2 先手（9张）", prob: calcProbability(deckSize, targetCopies, 9, neededCount) });
      results.push({ label: "T2 后手（10张）", prob: calcProbability(deckSize, targetCopies, 10, neededCount) });
    }

    return results;
  }, [deckSize, targetCopies, neededCount, comboMode]);

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-gradient mb-2">🎲 概率计算器</h1>
          <p className="text-gray-400 text-sm">
            基于超几何分布，精确计算起手抽到关键卡的概率
          </p>
        </div>

        {/* 输入面板 */}
        <GlassCard className="p-6 mb-6 animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">卡组总数</label>
              <input
                type="number"
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-pokemon-yellow focus:outline-none"
                value={deckSize}
                onChange={(e) => setDeckSize(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                {comboMode ? "卡牌A 投入数量" : "目标卡投入数量"}
              </label>
              <input
                type="number"
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-pokemon-yellow focus:outline-none"
                value={targetCopies}
                onChange={(e) => setTargetCopies(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">抽牌数量</label>
              <input
                type="number"
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-pokemon-yellow focus:outline-none"
                value={drawCount}
                onChange={(e) => setDrawCount(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">至少抽到</label>
              <input
                type="number"
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-pokemon-yellow focus:outline-none"
                value={neededCount}
                onChange={(e) => setNeededCount(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Combo 模式 */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setComboMode(!comboMode)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                comboMode
                  ? "bg-pokemon-yellow/20 border-pokemon-yellow text-pokemon-yellow"
                  : "bg-white/5 border-white/10 text-gray-400"
              }`}
            >
              🧩 Combo 双卡模式
            </button>
            {comboMode && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">卡牌B 投入数量：</span>
                <input
                  type="number"
                  className="w-20 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-pokemon-yellow focus:outline-none"
                  value={comboCopies2}
                  onChange={(e) => setComboCopies2(Number(e.target.value))}
                />
              </div>
            )}
          </div>
        </GlassCard>

        {/* 结果 */}
        <GlassCard className="p-6 mb-6 animate-fade-in-up text-center" glow>
          <p className="text-sm text-gray-400 mb-2">
            {comboMode
              ? "起手同时抽到两种卡的概率"
              : `抽 ${drawCount} 张牌，至少抽到 ${neededCount} 张目标卡`}
          </p>
          <p className={`text-5xl font-bold ${getColor()} transition-colors`}>
            {probPercent}%
          </p>
          <div className="mt-4 h-3 rounded-full bg-white/10 overflow-hidden max-w-md mx-auto">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                probability >= 0.8
                  ? "bg-green-400"
                  : probability >= 0.5
                    ? "bg-pokemon-yellow"
                    : probability >= 0.3
                      ? "bg-yellow-600"
                      : "bg-red-400"
              }`}
              style={{ width: `${Math.max(probability * 100, 2)}%` }}
            />
          </div>
        </GlassCard>

        {/* 场景对比 */}
        {scenarios.length > 0 && (
          <GlassCard className="p-6 animate-fade-in-up">
            <h3 className="text-sm font-semibold text-white mb-4">📊 常见场景概率</h3>
            <div className="space-y-3">
              {scenarios.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-32">{s.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        s.prob >= 0.8
                          ? "bg-green-400"
                          : s.prob >= 0.5
                            ? "bg-pokemon-yellow"
                            : s.prob >= 0.3
                              ? "bg-yellow-600"
                              : "bg-red-400"
                      }`}
                      style={{ width: `${Math.max(s.prob * 100, 2)}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-white w-14 text-right">
                    {(s.prob * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </main>
  );
}
