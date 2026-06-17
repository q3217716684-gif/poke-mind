"use client";

import { useState, useMemo } from "react";
import GlassCard from "@/components/GlassCard";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { DECISION_TREE, type TreeNode } from "@/data/decision-tree";

interface Decision {
  nodeId: string;
  question: string;
  answer: string;
}

export default function DecisionTreePage() {
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const currentNode: TreeNode | undefined = DECISION_TREE[currentNodeId];
  const isResult = currentNodeId === "result";
  const totalSteps = useMemo(() => {
    // 估计总步数
    let count = 0;
    let id = "start";
    const visited = new Set<string>();
    while (DECISION_TREE[id] && !visited.has(id) && id !== "result") {
      visited.add(id);
      id = DECISION_TREE[id].choices[0]?.nextNode || "result";
      count++;
    }
    return count + 1;
  }, []);

  const handleChoice = async (node: TreeNode, choice: typeof node.choices[0]) => {
    // 记录决策
    setDecisions((prev) => [
      ...prev,
      { nodeId: node.id, question: node.question, answer: choice.label },
    ]);
    setHistory((prev) => [...prev, node.id]);

    if (choice.nextNode === "result") {
      setCurrentNodeId("result");
      // 请求 AI 建议
      setLoading(true);
      try {
        const res = await fetch("/api/decision", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            decisions: [
              ...decisions,
              { nodeId: node.id, question: node.question, answer: choice.label },
            ],
          }),
        });
        const data = await res.json();
        setResult(data.analysis || "无法生成建议");
      } catch {
        setResult("请求失败，请重试");
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentNodeId(choice.nextNode);
    }
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const prevNodeId = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setDecisions((prev) => prev.slice(0, -1));
    setCurrentNodeId(prevNodeId);
    setResult("");
  };

  const handleReset = () => {
    setCurrentNodeId("start");
    setDecisions([]);
    setResult("");
    setHistory([]);
  };

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* 标题 */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            🌳 决策树
          </h1>
          <p className="text-gray-400 text-sm">
            对战中的每一步选择，AI 帮你理清思路
          </p>
        </div>

        {/* 进度条 */}
        <div className="mb-6 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500">
              步骤 {decisions.length + (isResult ? 1 : 0)}
            </span>
            {!isResult && (
              <span className="text-xs text-gray-600 ml-auto">
                约 {totalSteps} 步完成
              </span>
            )}
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pokemon-blue to-pokemon-yellow transition-all duration-500"
              style={{
                width: `${Math.min(((decisions.length + (isResult ? 1 : 0)) / totalSteps) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* 决策路径面包屑 */}
        {decisions.length > 0 && (
          <div className="mb-6 animate-fade-in-up">
            <p className="text-[10px] text-gray-600 mb-2">决策路径</p>
            <div className="flex flex-wrap gap-1.5">
              {decisions.map((d, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400"
                >
                  {d.answer}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 当前问题 */}
        {currentNode && !isResult && (
          <GlassCard className="p-6 animate-fade-in-up" glow>
            <div className="flex items-start gap-3 mb-4">
              <span className="text-3xl mt-1">🤔</span>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {currentNode.question}
                </h2>
                {currentNode.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {currentNode.description}
                  </p>
                )}
              </div>
            </div>

            {/* 选项 */}
            <div className="space-y-2">
              {currentNode.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(currentNode, choice)}
                  className="w-full text-left p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:border-pokemon-yellow/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {choice.icon}
                    </span>
                    <span className="text-white text-sm font-medium">
                      {choice.label}
                    </span>
                    <span className="ml-auto text-gray-600 group-hover:text-pokemon-yellow transition-colors">
                      →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>
        )}

        {/* 结果 */}
        {isResult && (
          <>
            <GlassCard className="p-6 mb-6 animate-fade-in-up text-center" glow>
              <p className="text-4xl mb-3">✅</p>
              <h2 className="text-xl font-bold text-white mb-2">
                决策路径完成！
              </h2>
              <p className="text-sm text-gray-400">
                共 {decisions.length} 个决策节点，AI 正在生成综合建议...
              </p>
            </GlassCard>

            {loading && <LoadingSpinner text="AI 正在分析你的决策路径..." />}

            {result && !loading && (
              <GlassCard className="p-6 animate-fade-in-up" glow>
                <h2 className="text-lg font-semibold text-white mb-4">
                  🎯 AI 综合建议
                </h2>
                <MarkdownRenderer content={result} />
              </GlassCard>
            )}
          </>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-3 mt-6 animate-fade-in-up">
          {history.length > 0 && !isResult && (
            <button
              onClick={handleBack}
              className="flex-1 py-3 rounded-xl font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
            >
              ← 上一步
            </button>
          )}
          {(isResult || decisions.length > 0) && (
            <button
              onClick={handleReset}
              className="flex-1 py-3 rounded-xl font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
            >
              🔄 重新开始
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
