"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import { useFavorites, type FavoriteDeck } from "@/hooks/useFavorites";

export default function FavoritesPage() {
  const { favorites, remove, reload } = useFavorites();
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-gradient mb-2">⭐ 我的收藏</h1>
          <p className="text-gray-400 text-sm">
            收藏的卡组列表和分析报告
          </p>
        </div>

        {favorites.length === 0 ? (
          <GlassCard className="p-12 text-center animate-fade-in-up">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-400">还没有收藏任何卡组</p>
            <p className="text-gray-600 text-xs mt-2">
              在卡组分析页面可以收藏分析结果
            </p>
            <Link
              href="/deck-analysis"
              className="inline-block mt-4 text-sm text-pokemon-yellow hover:underline"
            >
              → 去分析卡组
            </Link>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {favorites.map((deck) => (
              <GlassCard key={deck.id} className="p-5 animate-fade-in-up" hover>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white font-semibold">{deck.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(deck.createdAt).toLocaleString("zh-CN")}
                      {deck.tags.length > 0 && (
                        <span className="ml-2">
                          {deck.tags.map((t) => (
                            <span
                              key={t}
                              className="inline-block px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-gray-400 mr-1"
                            >
                              {t}
                            </span>
                          ))}
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(deck.id)}
                    className="text-gray-600 hover:text-red-400 transition text-sm shrink-0"
                  >
                    🗑️
                  </button>
                </div>

                {/* 卡组列表预览 */}
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                  {deck.deckList.slice(0, 100)}
                  {deck.deckList.length > 100 ? "..." : ""}
                </p>

                {/* 展开分析 */}
                <button
                  onClick={() =>
                    setExpanded(expanded === deck.id ? null : deck.id)
                  }
                  className="text-xs text-pokemon-yellow hover:underline"
                >
                  {expanded === deck.id ? "收起" : "查看分析"}
                </button>

                {expanded === deck.id && deck.analysis && (
                  <div className="mt-3 p-4 bg-black/20 rounded-lg text-xs text-gray-300 whitespace-pre-wrap max-h-60 overflow-y-auto border border-white/5">
                    {deck.analysis}
                  </div>
                )}

                {/* 快速操作 */}
                <div className="flex gap-2 mt-3">
                  <Link
                    href={`/deck-analysis?load=${deck.id}`}
                    className="text-[10px] px-3 py-1.5 rounded-lg bg-pokemon-blue/20 text-pokemon-blue hover:bg-pokemon-blue/30 transition"
                  >
                    🃏 重新分析
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
