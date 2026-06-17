"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import GlassCard from "@/components/GlassCard";

interface PTCGCard {
  id: string;
  name: string;
  supertype: string;
  subtypes?: string[];
  types?: string[];
  rarity?: string;
  images?: {
    small: string;
    large: string;
  };
  set?: {
    name: string;
    series: string;
  };
  tcgplayer?: {
    url: string;
    prices?: {
      holofoil?: { market: number };
      normal?: { market: number };
      reverseHolofoil?: { market: number };
    };
  };
}

function SkeletonCard() {
  return (
    <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-3 animate-pulse">
      <div className="w-full aspect-[245/342] rounded-lg mb-3 bg-white/5" />
      <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
      <div className="h-3 bg-white/5 rounded w-1/2" />
    </div>
  );
}

function CardImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      className="w-full aspect-[245/342] rounded-lg bg-white/5 overflow-hidden mb-3 relative"
    >
      {inView && (
        <>
          {!loaded && (
            <div className="absolute inset-0 bg-white/5 animate-pulse" />
          )}
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-contain transition-opacity duration-300 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setLoaded(true)}
          />
        </>
      )}
      {!inView && <div className="w-full h-full bg-white/5" />}
    </div>
  );
}

export default function CardDatabase() {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState<PTCGCard[]>([]);
  const [preloaded, setPreloaded] = useState<PTCGCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCard, setSelectedCard] = useState<PTCGCard | null>(null);
  const fetchedRef = useRef(false);

  const PAGE_SIZE = 20;

  // 首次加载 / 新搜索
  const fetchCards = useCallback(async (searchQuery: string, pageNum = 1) => {
    setLoading(true);
    setPage(pageNum);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        page: String(pageNum),
        pageSize: String(PAGE_SIZE),
      });
      const res = await fetch(`/api/cards?${params}`);
      const data = await res.json();
      const cards = data.cards || [];
      setCards(cards);
      setTotal(data.total || cards.length);
      setHasMore(data.hasMore ?? (cards.length === PAGE_SIZE));
      if (!searchQuery.trim()) {
        setPreloaded(cards);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  // 加载更多
  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const params = new URLSearchParams({
        q: query,
        page: String(nextPage),
        pageSize: String(PAGE_SIZE),
      });
      const res = await fetch(`/api/cards?${params}`);
      const data = await res.json();
      const newCards = data.cards || [];
      setCards((prev) => [...prev, ...newCards]);
      setPage(nextPage);
      setHasMore(data.hasMore ?? (newCards.length === PAGE_SIZE));
    } catch {
      // ignore
    } finally {
      setLoadingMore(false);
    }
  }, [query, page]);

  // 首次加载
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchCards("");
  }, [fetchCards]);

  // 搜索防抖
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (!query.trim() && preloaded.length > 0) {
        setCards(preloaded);
        setTotal(preloaded.length);
        setHasMore(false);
        setPage(1);
      } else {
        fetchCards(query, 1);
      }
    }, 400);
    return () => clearTimeout(debounce);
  }, [query, fetchCards, preloaded]);

  const handleSearch = () => {
    fetchCards(query);
  };

  const getPrice = (card: PTCGCard) => {
    const prices = card.tcgplayer?.prices;
    if (!prices) return null;
    const marketPrice =
      prices.holofoil?.market ||
      prices.normal?.market ||
      prices.reverseHolofoil?.market;
    if (marketPrice) return `$${marketPrice.toFixed(2)}`;
    return null;
  };

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            📚 卡牌数据库
          </h1>
          <p className="text-gray-400 text-sm">
            搜索宝可梦 PTCG 卡牌 · 支持中文搜索 · 数据来自 Pokémon TCG 官方 API
          </p>
        </div>

        {/* 搜索栏 */}
        <GlassCard className="p-4 mb-6 animate-fade-in-up">
          <div className="flex gap-3">
            <input
              className="flex-1 bg-transparent border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pokemon-yellow transition"
              placeholder="输入中文或英文搜索，例如：皮卡丘、喷火龙、Charizard..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-pokemon-yellow to-yellow-500 text-black hover:shadow-[0_0_20px_rgba(255,222,0,0.2)] transition-all"
            >
              搜索
            </button>
          </div>
          {total > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              共 {total} 张卡牌
              {query ? <> 匹配「{query}」</> : " · 热门卡牌速览"}
            </p>
          )}
        </GlassCard>

        {/* 加载中 */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* 卡牌网格 */}
        {!loading && cards.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {cards.map((card) => (
              <GlassCard
                key={card.id}
                hover
                className="p-3 cursor-pointer animate-fade-in-up overflow-hidden group"
              >
                <div onClick={() => setSelectedCard(card)}>
                  {card.images?.small ? (
                    <CardImage src={card.images.small} alt={card.name} />
                  ) : (
                    <div className="w-full aspect-[245/342] rounded-lg mb-3 bg-white/5 flex items-center justify-center text-gray-500 text-xs">
                      📷 暂无卡图
                    </div>
                  )}
                  <h3 className="text-sm font-semibold text-white truncate group-hover:text-pokemon-yellow transition-colors">
                    {card.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {card.types?.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-gray-300"
                      >
                        {t}
                      </span>
                    ))}
                    {card.rarity && (
                      <span className="text-[10px] text-gray-500 ml-auto">
                        {card.rarity}
                      </span>
                    )}
                  </div>
                  {getPrice(card) && (
                    <p className="text-xs text-pokemon-yellow mt-1 font-medium">
                      {getPrice(card)}
                    </p>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* 加载更多 */}
        {hasMore && !loading && (
          <div className="text-center mt-8">
            {loadingMore ? (
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <div className="w-5 h-5 border-2 border-pokemon-yellow border-t-transparent rounded-full animate-spin" />
                加载中...
              </div>
            ) : (
              <button
                onClick={loadMore}
                className="px-8 py-3 rounded-xl font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-pokemon-yellow/50 transition-all"
              >
                加载更多
              </button>
            )}
          </div>
        )}

        {/* 空状态 */}
        {!loading && cards.length === 0 && query && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500">未找到匹配的卡牌，试试其他关键词</p>
          </div>
        )}

        {/* 卡牌详情弹窗 */}
        {selectedCard && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up"
            onClick={() => setSelectedCard(null)}
          >
            <div
              className="bg-[#1a1a2e] border border-white/20 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-[0_0_60px_rgba(59,76,202,0.15)]"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedCard.images?.large ? (
                <img
                  src={selectedCard.images.large}
                  alt={selectedCard.name}
                  className="w-full rounded-xl mb-4"
                />
              ) : (
                <div className="w-full aspect-[245/342] rounded-xl mb-4 bg-white/5 flex items-center justify-center text-gray-500">
                  📷 暂无卡图
                </div>
              )}

              <h2 className="text-xl font-bold text-white mb-2">
                {selectedCard.name}
              </h2>

              <div className="flex flex-wrap gap-2 mb-3">
                {selectedCard.types?.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-1 rounded-full bg-white/10 text-white"
                  >
                    {t}
                  </span>
                ))}
                {selectedCard.subtypes?.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-300"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {selectedCard.set && (
                <p className="text-xs text-gray-500 mb-1">
                  系列：{selectedCard.set.series} · {selectedCard.set.name}
                </p>
              )}
              {selectedCard.rarity && (
                <p className="text-xs text-gray-500 mb-1">
                  稀有度：{selectedCard.rarity}
                </p>
              )}
              {getPrice(selectedCard) && (
                <p className="text-sm text-pokemon-yellow font-semibold">
                  市场价：{getPrice(selectedCard)}
                </p>
              )}

              <button
                className="mt-4 w-full py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition text-sm"
                onClick={() => setSelectedCard(null)}
              >
                关闭
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
