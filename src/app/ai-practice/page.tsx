"use client";

import { useState, useRef, useEffect } from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import LoadingSpinner from "@/components/LoadingSpinner";
import VoiceInput from "@/components/VoiceInput";
import useChatHistory from "@/hooks/useChatHistory";
import { practiceExamples } from "@/data/examples";
import { recordAction } from "@/lib/statsTracker";

export default function AIPractice() {
  const { messages, addMessage, clearHistory } = useChatHistory();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user" as const, content: input.trim() };
    addMessage(userMessage);
    setInput("");
    setLoading(true);
    recordAction("ai-practice");

    try {
      const currentMessages = [...messages, userMessage];
      const response = await fetch("/api/ai-practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: currentMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await response.json();

      addMessage({
        role: "assistant",
        content: data.analysis || "分析失败",
      });
    } catch {
      addMessage({
        role: "assistant",
        content: "请求失败，请重试",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] md:h-screen flex flex-col">
      {/* 顶部栏 */}
      <header className="border-b border-white/10 px-6 py-3 flex items-center gap-4 shrink-0 backdrop-blur-md bg-[#08080f]/50">
        <h1 className="text-lg font-semibold text-gradient">🤖 AI 陪练</h1>
        <span className="text-xs text-gray-500">
          {messages.length - 1} 条对话
        </span>
        <button
          onClick={clearHistory}
          className="ml-auto text-xs text-gray-500 hover:text-red-400 transition"
        >
          清除对话
        </button>
      </header>

      {/* 聊天区域 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-3xl w-full mx-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3 backdrop-blur-md ${
                msg.role === "user"
                  ? "bg-pokemon-blue/80 text-white shadow-[0_4px_20px_rgba(59,76,202,0.3)]"
                  : "bg-white/[0.04] border border-white/[0.08] text-gray-200"
              }`}
            >
              {msg.role === "assistant" ? (
                <MarkdownRenderer content={msg.content} />
              ) : (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-md rounded-2xl px-5 py-4 max-w-[85%]">
              <LoadingSpinner text="AI 正在思考..." />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="border-t border-white/10 px-4 py-4 shrink-0 backdrop-blur-md bg-[#08080f]/50">
        {/* 示例模板 */}
        {messages.length <= 1 && (
          <div className="max-w-3xl mx-auto mb-3">
            <p className="text-xs text-gray-500 mb-1.5">快速填入局面：</p>
            <div className="flex flex-wrap gap-1.5">
              {practiceExamples.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => setInput(ex.text)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-pokemon-yellow/50 transition-all text-left"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-pokemon-yellow transition-all text-sm"
              placeholder="描述局面，或追问 AI...（Enter 发送，Shift+Enter 换行）"
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <VoiceInput
              onResult={setInput}
              onAppend={(text) => setInput((prev) => prev + text)}
              className="absolute bottom-2 right-2"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-pokemon-yellow to-yellow-500 text-black hover:from-yellow-400 hover:to-yellow-600 hover:shadow-[0_0_25px_rgba(255,222,0,0.2)] shrink-0"
          >
            {loading ? "..." : "发送"}
          </button>
        </div>
      </div>
    </div>
  );
}
