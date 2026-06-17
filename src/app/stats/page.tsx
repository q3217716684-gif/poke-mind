"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/GlassCard";
import LoadingSpinner from "@/components/LoadingSpinner";

interface DeckMeta {
  name: string;
  winRate: number;
  popularity: number;
  totalGames: number;
  tier: "S" | "A" | "B" | "C";
  keyCards: string[];
  goodMatchups: string[];
  badMatchups: string[];
}

const TIER_COLORS: Record<string, string> = {
  S: "bg-red-500",
  A: "bg-yellow-500",
  B: "bg-green-500",
  C: "bg-gray-500",
};

function WinRateBar({ rate, label }: { rate: number; label?: string }) {
  const color =
    rate >= 55 ? "bg-green-400" : rate >= 52 ? "bg-pokemon-yellow" : rate >= 48 ? "bg-yellow-600" : "bg-red-400";

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-xs text-gray-400 w-8">{label}</span>}
      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000`}
          style={{ width: `${rate}%` }}
        />
      </div>
      <span className={`text-xs font-semibold w-9 text-right ${color.replace("bg-", "text-")}`}>
        {rate}%
      </span>
    </div>
  );
}

export default function StatsPage() {
  const [decks, setDecks] = useState<DeckMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/meta")
      .then((r) => r.json())
      .then((data) => {
        setDecks(data.decks || []);
        setSource(data.source || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const selectedDeck = decks.find((d) => d.name === selected);
  const sTier = decks.filter((d) => d.tier === "S");
  const aTier = decks.filter((d) => d.tier === "A");
  const bTier = decks.filter((d) => d.tier === "B");

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* 标题 */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            🏆 竞技环境
          </h1>
          <p className="text-gray-400 text-sm">
            PTCG 卡组胜率与 Meta 数据
            {source && (
              <span className="text-gray-600 ml-2">· 数据来源：{source}</span>
            )}
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="加载竞技数据中..." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：卡组列表 */}
            <div className="lg:col-span-2 space-y-6">
              {/* S 级 */}
              {sTier.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-red-400 mb-3">S Tier · 顶级</h2>
                  <div className="space-y-2">
                    {sTier.map((deck, i) => (
                      <GlassCard
                        key={deck.name}
                        hover
                        className={`p-4 cursor-pointer animate-fade-in-up transition-all ${
                          selected === deck.name ? "border-pokemon-yellow/50 shadow-[0_0_20px_rgba(255,222,0,0.1)]" : ""
                        }`}
                      >
                        <div onClick={() => setSelected(selected === deck.name ? null : deck.name)}>
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white ${TIER_COLORS[deck.tier]}`}>
                              {deck.tier}
                            </span>
                            <h3 className="text-white font-semibold flex-1">{deck.name}</h3>
                            <span className="text-sm font-bold text-white">{deck.winRate}%</span>
                          </div>
                          <WinRateBar rate={deck.winRate} />
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-[10px] text-gray-500">
                              {deck.totalGames.toLocaleString()} 场对局
                            </span>
                            <span className="text-[10px] text-gray-500">
                              热度 {((deck.popularity / (decks[0]?.popularity || 1)) * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              )}

              {/* A 级 */}
              {aTier.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-yellow-400 mb-3">A Tier · 强势</h2>
                  <div className="space-y-2">
                    {aTier.map((deck) => (
                      <GlassCard
                        key={deck.name}
                        hover
                        className={`p-4 cursor-pointer animate-fade-in-up transition-all ${
                          selected === deck.name ? "border-pokemon-yellow/50" : ""
                        }`}
                      >
                        <div onClick={() => setSelected(selected === deck.name ? null : deck.name)}>
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-black ${TIER_COLORS[deck.tier]}`}>
                              {deck.tier}
                            </span>
                            <h3 className="text-white font-semibold flex-1">{deck.name}</h3>
                            <span className="text-sm font-bold text-white">{deck.winRate}%</span>
                          </div>
                          <WinRateBar rate={deck.winRate} />
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              )}

              {/* B 级 */}
              {bTier.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-green-400 mb-3">B Tier · 可玩</h2>
                  <div className="space-y-2">
                    {bTier.map((deck) => (
                      <GlassCard
                        key={deck.name}
                        hover
                        className={`p-4 cursor-pointer animate-fade-in-up transition-all ${
                          selected === deck.name ? "border-pokemon-yellow/50" : ""
                        }`}
                      >
                        <div onClick={() => setSelected(selected === deck.name ? null : deck.name)}>
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white ${TIER_COLORS[deck.tier]}`}>
                              {deck.tier}
                            </span>
                            <h3 className="text-white font-semibold flex-1">{deck.name}</h3>
                            <span className="text-sm font-bold text-white">{deck.winRate}%</span>
                          </div>
                          <WinRateBar rate={deck.winRate} />
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 右侧：详情面板 */}
            <div className="space-y-6">
              {selectedDeck ? (
                <GlassCard className="p-6 animate-fade-in-up sticky top-6" glow>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold text-white ${TIER_COLORS[selectedDeck.tier]}`}>
                      {selectedDeck.tier}
                    </span>
                    <h2 className="text-lg font-bold text-white">{selectedDeck.name}</h2>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">胜率</p>
                    <p className="text-3xl font-bold text-white">{selectedDeck.winRate}%</p>
                    <p className="text-xs text-gray-500 mt-1">
                      基于 {selectedDeck.totalGames.toLocaleString()} 场公开赛事对局
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">核心单卡</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDeck.keyCards.map((card) => (
                        <span
                          key={card}
                          className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300"
                        >
                          {card}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedDeck.goodMatchups.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-green-400 mb-2">✅ 优势对局</p>
                      <div className="space-y-1">
                        {selectedDeck.goodMatchups.map((m) => (
                          <p key={m} className="text-xs text-gray-300">{m}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDeck.badMatchups.length > 0 && (
                    <div>
                      <p className="text-xs text-red-400 mb-2">⚠️ 劣势对局</p>
                      <div className="space-y-1">
                        {selectedDeck.badMatchups.map((m) => (
                          <p key={m} className="text-xs text-gray-300">{m}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-gray-600 mt-4 pt-4 border-t border-white/5">
                    数据来源：Limitless TCG 公开赛事数据
                  </p>
                </GlassCard>
              ) : (
                <GlassCard className="p-6 animate-fade-in-up">
                  <div className="text-center py-8">
                    <p className="text-4xl mb-3">👆</p>
                    <p className="text-gray-400 text-sm">
                      点击左侧卡组查看详情
                    </p>
                    <p className="text-gray-600 text-xs mt-2">
                      含核心单卡、优势/劣势对局
                    </p>
                  </div>
                </GlassCard>
              )}

              {/* 说明 */}
              <GlassCard className="p-4">
                <h3 className="text-xs font-semibold text-gray-400 mb-2">📖 分级说明</h3>
                <div className="space-y-1.5 text-[10px] text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-red-500 text-white flex items-center justify-center font-bold">S</span>
                    胜率 ≥ 55%，赛事热门
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-yellow-500 text-black flex items-center justify-center font-bold">A</span>
                    胜率 52-54%，主流选择
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-green-500 text-white flex items-center justify-center font-bold">B</span>
                    胜率 48-51%，可竞技
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-gray-500 text-white flex items-center justify-center font-bold">C</span>
                    胜率 &lt; 48%，娱乐向
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
