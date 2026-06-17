"use client";

import { useState } from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import LoadingSpinner from "@/components/LoadingSpinner";
import GlassCard from "@/components/GlassCard";
import VoiceInput from "@/components/VoiceInput";
import ExportButton from "@/components/ExportButton";
import { battleExamples } from "@/data/examples";
import { recordAction } from "@/lib/statsTracker";

export default function BattleReview() {
  const [battleLog, setBattleLog] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!battleLog.trim()) return;
    setLoading(true);
    setResult("");
    recordAction("battle-review");

    try {
      const response = await fetch("/api/battle-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ battleLog }),
      });
      const data = await response.json();
      setResult(data.analysis || "分析失败，请重试");
    } catch {
      setResult("请求失败，请检查网络连接");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-4 animate-fade-in-up">
          <span className="text-3xl">🔍</span>
          <h1 className="text-3xl font-bold text-gradient">对战复盘</h1>
        </div>
        <p className="text-gray-400 mb-6 animate-fade-in-up">
          输入你的对战记录，AI 将分析关键失误并生成复盘报告
        </p>

        {/* 示例模板 */}
        <div className="mb-4 animate-fade-in-up">
          <p className="text-xs text-gray-500 mb-2">快速填入示例：</p>
          <div className="flex flex-wrap gap-2">
            {battleExamples.map((ex) => (
              <button
                key={ex.label}
                onClick={() => setBattleLog(ex.text)}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-pokemon-yellow/50 hover:shadow-[0_0_15px_rgba(255,222,0,0.1)] transition-all"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        <GlassCard className="p-6 mb-6 animate-fade-in-up">
          <label className="block text-sm text-gray-300 mb-3">
            请输入对战记录：
          </label>
          <div className="relative">
            <textarea
              className="w-full h-48 bg-black/20 border border-white/10 rounded-xl p-4 pr-14 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-pokemon-yellow transition-all"
              placeholder="描述你的对战过程..."
              value={battleLog}
              onChange={(e) => setBattleLog(e.target.value)}
            />
            <VoiceInput
              onResult={setBattleLog}
              onAppend={(text) => setBattleLog((prev) => prev + text)}
              className="absolute bottom-3 right-3"
            />
          </div>
        </GlassCard>

        <button
          onClick={handleReview}
          disabled={loading || !battleLog.trim()}
          className="w-full py-3.5 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-pokemon-yellow to-yellow-500 text-black hover:from-yellow-400 hover:to-yellow-600 hover:shadow-[0_0_30px_rgba(255,222,0,0.2)] animate-fade-in-up"
        >
          {loading ? "AI 复盘分析中..." : "⚡ 开始复盘"}
        </button>

        {loading && <LoadingSpinner text="AI 正在复盘中..." />}

        {result && !loading && (
          <GlassCard className="mt-8 p-6 animate-fade-in-up" glow>
            <h2 className="text-lg font-semibold text-white mb-4">
              📋 复盘报告
            </h2>
            <MarkdownRenderer content={result} />
            <div className="mt-6">
              <ExportButton
                content={result}
                title="对战复盘报告"
                type="report"
              />
            </div>
          </GlassCard>
        )}
      </div>
    </main>
  );
}
