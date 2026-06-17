"use client";

import { useState, useRef, useEffect } from "react";

interface CardInfo {
  name: string;
  image?: string;
  types?: string[];
  rarity?: string;
  set?: string;
}

// 缓存已查询的卡牌
const cardCache = new Map<string, CardInfo>();

export function useCardTooltip() {
  const [tooltip, setTooltip] = useState<{
    card: CardInfo;
    x: number;
    y: number;
  } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const showTooltip = async (
    cardName: string,
    event: React.MouseEvent
  ) => {
    // 清除之前的计时器
    if (timerRef.current) clearTimeout(timerRef.current);

    // 延迟显示
    timerRef.current = setTimeout(async () => {
      // 检查缓存
      if (cardCache.has(cardName)) {
        setTooltip({
          card: cardCache.get(cardName)!,
          x: event.clientX,
          y: event.clientY,
        });
        return;
      }

      // 搜索卡牌
      try {
        const params = new URLSearchParams({
          q: cardName,
          page: "1",
          pageSize: "1",
        });
        const res = await fetch(`/api/cards?${params}`);
        const data = await res.json();
        const card = data.cards?.[0];
        if (card) {
          const info: CardInfo = {
            name: card.name,
            image: card.images?.small,
            types: card.types,
            rarity: card.rarity,
            set: card.set?.name,
          };
          cardCache.set(cardName, info);
          setTooltip({ card: info, x: event.clientX, y: event.clientY });
        }
      } catch {
        // ignore
      }
    }, 400);
  };

  const hideTooltip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setTooltip(null);
  };

  const TooltipElement = tooltip ? (
    <div
      className="fixed z-[100] pointer-events-none"
      style={{
        left: tooltip.x + 12,
        top: tooltip.y - 100,
      }}
    >
      <div className="bg-[#1a1a2e] border border-white/20 rounded-xl p-3 shadow-[0_10px_40px_rgba(0,0,0,0.6)] max-w-[200px] animate-fade-in-up">
        {tooltip.card.image && (
          <img
            src={tooltip.card.image}
            alt={tooltip.card.name}
            className="w-full rounded-lg mb-2"
          />
        )}
        <p className="text-sm font-semibold text-white truncate">
          {tooltip.card.name}
        </p>
        {tooltip.card.types && (
          <div className="flex gap-1 mt-1">
            {tooltip.card.types.map((t) => (
              <span
                key={t}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-gray-300"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        {tooltip.card.rarity && (
          <p className="text-[10px] text-gray-500 mt-1">{tooltip.card.rarity}</p>
        )}
      </div>
    </div>
  ) : null;

  return { showTooltip, hideTooltip, TooltipElement };
}
