"use client";

import { useState } from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import LoadingSpinner from "@/components/LoadingSpinner";
import GlassCard from "@/components/GlassCard";
import VoiceInput from "@/components/VoiceInput";
import ExportButton from "@/components/ExportButton";
import { deckExamples } from "@/data/examples";
import { recordAction } from "@/lib/statsTracker";
import { useFavorites } from "@/hooks/useFavorites";

export default function DeckAnalysis() {
  const [deckList, setDeckList] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [importCode, setImportCode] = useState("");
  const [deckName, setDeckName] = useState("");
  const [saved, setSaved] = useState(false);
  const { save } = useFavorites();

  const handleAnalyze = async () => {
    if (!deckList.trim()) return;
    setLoading(true);
    setResult("");
    setSaved(false);
    recordAction("deck-analysis");

    try {
      const response = await fetch("/api/deck-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deckList }),
      });
      const data = await response.json();
      setResult(data.analysis || "分析失败，请重试");
    } catch {
      setResult("请求失败，请检查网络连接");
    } finally {
      setLoading(false);
    }
  };

  // PTCGL 卡组代码导入
  const handleImportCode = () => {
    if (!importCode.trim()) return;
    try {
      // 尝试 base64 解码
      const decoded = atob(importCode.trim());
      const lines = decoded.split("\n").filter(Boolean);
      if (lines.length > 0) {
        setDeckList(lines.join("\n"));
        setImportCode("");
      }
    } catch {
      // 如果不是 base64，直接当文本处理
      setDeckList(importCode.trim());
      setImportCode("");
    }
  };

  // 收藏
  const handleSave = () => {
    if (!deckList.trim()) return;
    save({
      name: deckName || `卡组分析 ${new Date().toLocaleDateString("zh-CN")}`,
      deckList,
      analysis: result || undefined,
      tags: ["卡组分析"],
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-4 animate-fade-in-up">
          <span className="text-3xl">🃏</span>
          <h1 className="text-3xl font-bold text-gradient">卡组分析</h1>
        </div>
        <p className="text-gray-400 mb-6 animate-fade-in-up">
          输入卡组列表或粘贴 PTCGL 代码，AI 深度分析
        </p>

        {/* PTCGL 代码导入 */}
        <GlassCard className="p-4 mb-4 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-gray-300">
              📥 从 PTCG Live 导入
            </span>
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-pokemon-yellow transition"
              placeholder="粘贴 PTCGL 导出代码..."
              value={importCode}
              onChange={(e) => setImportCode(e.target.value)}
            />
            <button
              onClick={handleImportCode}
              disabled={!importCode.trim()}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-pokemon-blue text-white hover:bg-pokemon-blue/80 transition disabled:opacity-50"
            >
              导入
            </button>
          </div>
        </GlassCard>

        {/* 示例模板 */}
        <div className="mb-4 animate-fade-in-up">
          <p className="text-xs text-gray-500 mb-2">快速填入示例：</p>
          <div className="flex flex-wrap gap-2">
            {deckExamples.map((ex) => (
              <button
                key={ex.label}
                onClick={() => setDeckList(ex.text)}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-pokemon-yellow/50 transition-all"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* 输入区域 + 语音 */}
        <GlassCard className="p-6 mb-6 animate-fade-in-up">
          <label className="block text-sm text-gray-300 mb-3">
            卡组列表（每行一张）：
          </label>
          <div className="relative">
            <textarea
              className="w-full h-48 bg-black/20 border border-white/10 rounded-xl p-4 pr-14 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-pokemon-yellow transition-all text-sm"
              placeholder={"皮卡丘 V ×4\n皮卡丘 VMAX ×3\n博士的研究 ×4\n高级球 ×4"}
              value={deckList}
              onChange={(e) => setDeckList(e.target.value)}
            />
            <VoiceInput
              onResult={setDeckList}
              onAppend={(text) => setDeckList((prev) => prev + text)}
              className="absolute bottom-3 right-3"
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-gray-500 text-xs">
              {deckList.trim() ? deckList.split("\n").filter(Boolean).length : 0} 张卡牌
            </p>
            <p className="text-gray-600 text-[10px]">🎤 支持语音输入</p>
          </div>
        </GlassCard>

        {/* 按钮组 */}
        <div className="space-y-3 animate-fade-in-up">
          <button
            onClick={handleAnalyze}
            disabled={loading || !deckList.trim()}
            className="w-full py-3.5 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-pokemon-yellow to-yellow-500 text-black hover:from-yellow-400 hover:to-yellow-600 hover:shadow-[0_0_30px_rgba(255,222,0,0.2)]"
          >
            {loading ? "AI 分析中..." : "⚡ 开始分析"}
          </button>

          {deckList.trim() && (
            <div className="flex gap-2">
              <input
                className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-pokemon-yellow transition"
                placeholder="起个名字（可选）"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
              />
              <button
                onClick={handleSave}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                  saved
                    ? "bg-green-500 text-white"
                    : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                }`}
              >
                {saved ? "✅ 已收藏" : "⭐ 收藏"}
              </button>
            </div>
          )}
        </div>

        {loading && <LoadingSpinner text="AI 正在分析你的卡组..." />}

        {/* 结果 + 导出 */}
        {result && !loading && (
          <GlassCard className="mt-8 p-6 animate-fade-in-up" glow>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">📋 分析结果</h2>
            </div>
            <MarkdownRenderer content={result} />
            <div className="mt-6">
              <ExportButton
                content={result}
                title={deckName || "卡组分析报告"}
                type="analysis"
              />
            </div>
          </GlassCard>
        )}
      </div>
    </main>
  );
}
