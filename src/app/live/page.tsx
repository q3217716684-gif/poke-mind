"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/GlassCard";
import LoadingSpinner from "@/components/LoadingSpinner";

interface LiveEvent {
  id: string;
  name: string;
  date: string;
  status: "live" | "upcoming" | "recent";
  players: number;
  format: string;
  topDecks?: Array<{
    name: string;
    winRate: number;
    count: number;
  }>;
}

const STATUS_BADGE: Record<string, { label: string; color: string; dot: string }> = {
  live: { label: "直播中", color: "bg-red-500", dot: "animate-pulse" },
  upcoming: { label: "即将开始", color: "bg-yellow-500", dot: "" },
  recent: { label: "已结束", color: "bg-gray-500", dot: "" },
};

export default function LivePage() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextRefresh, setNextRefresh] = useState(60);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchEvents = () => {
    fetch("/api/meta/live")
      .then((r) => r.json())
      .then((data) => {
        setEvents(data.events || []);
        setNextRefresh(data.nextRefresh || 60);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">
              📡 赛事直播
            </h1>
            <p className="text-gray-400 text-sm">
              实时 PTCG 赛事数据 · 每 60 秒自动刷新
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">下次刷新</p>
            <p className="text-sm text-pokemon-yellow font-semibold">
              {nextRefresh}s
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="加载赛事数据..." />
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <GlassCard
                key={event.id}
                className="p-5 animate-fade-in-up overflow-hidden"
                hover
              >
                <div className="flex items-start gap-3">
                  {/* 状态指示 */}
                  <div className="shrink-0 mt-1">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${STATUS_BADGE[event.status].color} ${STATUS_BADGE[event.status].dot}`}
                    />
                  </div>

                  <div className="flex-1 min-w-0" onClick={() => setExpanded(expanded === event.id ? null : event.id)}>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full text-white ${STATUS_BADGE[event.status].color}`}
                      >
                        {STATUS_BADGE[event.status].label}
                      </span>
                      <h3 className="text-white font-semibold truncate">
                        {event.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📅 {new Date(event.date).toLocaleDateString("zh-CN")}</span>
                      {event.players > 0 && (
                        <span>👥 {event.players.toLocaleString()} 人参赛</span>
                      )}
                      <span>🎮 {event.format}</span>
                      {event.topDecks && (
                        <button
                          onClick={() =>
                            setExpanded(expanded === event.id ? null : event.id)
                          }
                          className="text-pokemon-yellow hover:underline ml-auto"
                        >
                          {expanded === event.id ? "收起" : "查看 Meta"}
                        </button>
                      )}
                    </div>

                    {/* 展开的 Meta 数据 */}
                    {expanded === event.id && event.topDecks && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-xs text-gray-500 mb-3">
                          热门卡组分布
                        </p>
                        <div className="space-y-2">
                          {(event.topDecks || []).map((deck) => (
                            <div key={deck.name} className="flex items-center gap-3">
                              <span className="text-xs text-gray-300 w-32 truncate">
                                {deck.name}
                              </span>
                              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    deck.winRate >= 55
                                      ? "bg-green-400"
                                      : deck.winRate >= 50
                                        ? "bg-pokemon-yellow"
                                        : "bg-red-400"
                                  }`}
                                  style={{
                                    width: `${deck.winRate}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-white w-10 text-right">
                                {deck.winRate}%
                              </span>
                              <span className="text-[10px] text-gray-500 w-10 text-right">
                                ×{deck.count}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}

            {events.length === 0 && (
              <GlassCard className="p-12 text-center">
                <p className="text-5xl mb-4">📡</p>
                <p className="text-gray-400">暂无赛事数据</p>
                <p className="text-gray-600 text-xs mt-2">
                  Limitless TCG API 暂不可用，稍后自动重试
                </p>
              </GlassCard>
            )}
          </div>
        )}

        <p className="text-center text-[10px] text-gray-600 mt-8">
          数据来源：Limitless TCG · 自动每 60 秒刷新
        </p>
      </div>
    </main>
  );
}
