"use client";

import { useState } from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import LoadingSpinner from "@/components/LoadingSpinner";
import GlassCard from "@/components/GlassCard";
import { deckExamples } from "@/data/examples";

export default function DeckCompare() {
  const [deckA, setDeckA] = useState("");
  const [deckB, setDeckB] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!deckA.trim() || !deckB.trim()) return;
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/deck-compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deckA, deckB }),
      });
      const data = await res.json();
      setResult(data.analysis || "分析失败");
    } catch {
      setResult("请求失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-gradient mb-2">⚔️ 卡组对比</h1>
          <p className="text-gray-400 text-sm">
            输入两套卡组，AI 进行全方位对比分析
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* 卡组A */}
          <GlassCard className="p-4 animate-fade-in-up">
            <h3 className="text-sm font-semibold text-pokemon-blue mb-2">🔵 卡组 A</h3>
            <textarea
              className="w-full h-40 bg-black/20 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 resize-none text-xs focus:outline-none focus:border-pokemon-blue transition"
              placeholder="输入第一套卡组..."
              value={deckA}
              onChange={(e) => setDeckA(e.target.value)}
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {deckExamples.slice(0, 2).map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => setDeckA(ex.text)}
                  className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* 卡组B */}
          <GlassCard className="p-4 animate-fade-in-up">
            <h3 className="text-sm font-semibold text-red-400 mb-2">🔴 卡组 B</h3>
            <textarea
              className="w-full h-40 bg-black/20 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 resize-none text-xs focus:outline-none focus:border-red-400 transition"
              placeholder="输入第二套卡组..."
              value={deckB}
              onChange={(e) => setDeckB(e.target.value)}
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {deckExamples.slice(1, 3).map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => setDeckB(ex.text)}
                  className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        <button
          onClick={handleCompare}
          disabled={loading || !deckA.trim() || !deckB.trim()}
          className="w-full py-3.5 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-pokemon-yellow to-yellow-500 text-black hover:from-yellow-400 hover:to-yellow-600 hover:shadow-[0_0_30px_rgba(255,222,0,0.2)] animate-fade-in-up mb-6"
        >
          {loading ? "AI 对比分析中..." : "⚔️ 开始对比"}
        </button>

        {loading && <LoadingSpinner text="AI 正在对比两套卡组..." />}

        {result && !loading && (
          <GlassCard className="p-6 animate-fade-in-up" glow>
            <h2 className="text-lg font-semibold text-white mb-4">📋 对比报告</h2>
            <MarkdownRenderer content={result} />
          </GlassCard>
        )}
      </div>
    </main>
  );
}
