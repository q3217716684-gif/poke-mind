// 聊天记录本地存储 Hook
"use client";

import { useState, useCallback, useEffect } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "pokemind-chat-history";
const MAX_MESSAGES = 50; // 最多保存 50 条消息

function loadHistory(): ChatMessage[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data;
  } catch {
    // 解析失败则清除
    localStorage.removeItem(STORAGE_KEY);
  }
  return null;
}

function saveHistory(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  try {
    // 只保留最近的 N 条
    const toSave = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // 存储满了就忽略
  }
}

export default function useChatHistory() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return (
      loadHistory() ?? [
        {
          role: "assistant" as const,
          content:
            "你好！我是你的 PTCG 对战教练 🤖\n\n请描述当前的场面局势（双方场上宝可梦、手牌数量、能量情况等），我会帮你分析最佳决策。\n\n可以随时追问，我会记住之前的对话内容。",
        },
      ]
    );
  });

  // 消息变化时自动保存
  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  const clearHistory = useCallback(() => {
    setMessages([
      {
        role: "assistant" as const,
        content: "对话已清除，有什么可以帮你的？",
      },
    ]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  return { messages, setMessages, addMessage, clearHistory };
}
